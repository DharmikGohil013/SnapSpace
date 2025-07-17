using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System;

public class ARScreenshotButton : MonoBehaviour
{
    public Button screenshotButton;
    public Camera arCamera;

    void Start()
    {
        screenshotButton.onClick.AddListener(() => StartCoroutine(CaptureAndSave()));
    }

    IEnumerator CaptureAndSave()
    {
        yield return new WaitForEndOfFrame();

        int width = Screen.width;
        int height = Screen.height;

        RenderTexture rt = new RenderTexture(width, height, 24);
        arCamera.targetTexture = rt;
        arCamera.Render();

        RenderTexture.active = rt;
        Texture2D screenshot = new Texture2D(width, height, TextureFormat.RGB24, false);
        screenshot.ReadPixels(new Rect(0, 0, width, height), 0, 0);
        screenshot.Apply();

        arCamera.targetTexture = null;
        RenderTexture.active = null;
        Destroy(rt);

#if UNITY_ANDROID || UNITY_IOS
        string filename = "AR_Screenshot_" + DateTime.Now.ToString("yyyyMMdd_HHmmss") + ".png";
        NativeGallery.SaveImageToGallery(screenshot, "MyARPhotos", filename, (success, path) =>
        {
            Debug.Log(success ? $"✅ Saved to: {path}" : "❌ Failed to save.");
        });
#else
        Debug.Log("NativeGallery only works on Android/iOS.");
#endif

        Destroy(screenshot);
    }
}
