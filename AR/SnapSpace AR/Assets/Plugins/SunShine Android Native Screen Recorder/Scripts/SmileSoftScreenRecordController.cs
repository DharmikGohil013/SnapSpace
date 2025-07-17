using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public class SmileSoftScreenRecordController : MonoBehaviour
{
	public static SmileSoftScreenRecordController instance;

	private string _fileProvider = "com.SmileSoft.unityplugin.ScreenRecordProvider";

	private AndroidJavaObject screenRecorder;

	private ReplayKitHelper _iosRecorder;

	private bool _isIosTryingToStartRecording = false;

	private void Awake()
	{
		if (instance == null)
			instance = this;

		Setup();
	}

    private void Start()
    {
		//Debug.Log("U>> Height is " + Screen.height + " Width " + Screen.width);
    }


	void OnApplicationFocus(bool hasFocus)
	{
		if (IsIosPlatform() && hasFocus && _isIosTryingToStartRecording)
		{
			Invoke("CheckIsRecording", 1.0f);
		}
	}

	private void CheckIsRecording()
    {
		OnIosRecordStatus(_iosRecorder.IsRecording());
	}

	void Setup()
	{
		if (IsAndroidPlatform())
		{
			screenRecorder = new AndroidJavaObject("com.SmileSoft.unityplugin.ScreenCapture.ScreenRecordFragment");
			screenRecorder?.Call("SetUp");
		}

		if (IsIosPlatform())
		{
			 _iosRecorder = new ReplayKitHelper();
		}
	}

	public void StartRecording()
	{
		if (IsAndroidPlatform())
			screenRecorder?.Call("StartRecording");

		if (IsIosPlatform())
        {

			if (_iosRecorder.IsRecorderAvailable())
            {
				_isIosTryingToStartRecording = true;
				_iosRecorder.StartRecording();
			}
            else
            {
				OnIosRecordStatus(false);
			}
        }
			
	}

	public string StopRecording()
	{
		if (IsAndroidPlatform())
		{
			string recordedPath = screenRecorder?.Call<string>("StopRecording");
			Debug.Log("Unity>> record path : " + recordedPath);
			return recordedPath;
		}

		if (IsIosPlatform())
        {
			_iosRecorder.StopRecording();
        }
			

		return null;
	}

	

	public void SetVideoStoringDestination(string destination)
	{
		if (IsAndroidPlatform())
			screenRecorder?.Call("SetVideoStoringDestination", destination);
	}
	public void SetStoredFolderName(string folderName)
	{
		if (IsAndroidPlatform())
			screenRecorder?.Call("SetVideoStoredFolderName", folderName);
	}

	public void SetVideoName(string videoName)
	{
		if (IsAndroidPlatform())
			screenRecorder?.Call("SetVideoName", videoName);
	}

	public void SetGalleryAddingCapabilities(bool canAddintoGallery)
	{
		if (IsAndroidPlatform())
			screenRecorder?.Call("SetGalleryAddingCapabilities", canAddintoGallery);
	}

	public void SetAudioCapabilities(bool canRecordAudio)
	{
		if (IsAndroidPlatform())
			screenRecorder?.Call("SetAudioCapabilities", canRecordAudio);
		if (IsIosPlatform())
			_iosRecorder.SetAudioCapability(canRecordAudio);
	}
	public void SetFPS(int fps)
	{
		if (IsAndroidPlatform())
			screenRecorder?.Call("SetVideoFps", fps);
	}

	public void SetVideoRotation(int rotation)
	{
		if (IsAndroidPlatform())
			screenRecorder?.Call("SetVideoRotation", rotation);
	}

	public void SetBitRate(int bitRate)
	{
		if (IsAndroidPlatform())
			screenRecorder?.Call("SetBitrate", bitRate);
	}

	public void SetVideoSize(int width, int height)
	{
		if (IsAndroidPlatform())
			screenRecorder?.Call("SetVideoSize", width, height);
	}

	public void SetVideoEncoder(int encoder)
	{
		if (IsAndroidPlatform())
			screenRecorder?.Call("SetVideoEncoder", encoder);
	}

	public void PreviewVideo(string videoPath)
	{
		if (IsAndroidPlatform() && (videoPath != null && File.Exists(videoPath)))
        {
			screenRecorder?.Call("PreviewVideo", videoPath);
			return;
		}

		if (IsIosPlatform())
        {
			StartCoroutine(IosPreview((isSuccess) => {
				
			}));
		}
	}

	// Wait a bit for preparing the preview
	private IEnumerator IosPreview (System.Action<bool> callback)
	{
		yield return new WaitForSeconds(1.0f);
		bool isSuccess = _iosRecorder.ShowPreview();
		callback(isSuccess);

	}

	public void ShareVideo(string filePath,string message, string title)
	{
		if (IsAndroidPlatform() &&  (filePath != null && File.Exists(filePath)))
			screenRecorder?.Call("ShareVideo", filePath,message,title,_fileProvider);
	}

	public enum VideoEncoder
	{
		DEFAULT = 0, H263 = 1, H264 = 2, MPEG_4_SP = 3, VP8 = 4, HEVC = 5
	}


	//CallBack From Android library
	public void OnRecordPermissionGranted(string status)
	{
		if (status == "True")
        {
			Debug.Log("Unity>> Record Permission Granted  ");
        }
        else
        {
			Debug.Log("Unity>> Record Permission Not Granted ");
		}
	}

	public void OnRecordStartStatus(string status)
	{
		if (status == "True")
		{
			Debug.Log("Unity>> Record Started  ");
		}
		else
		{
			Debug.Log("Unity>> Record Failed ");
		}
	}


	// Only Work in IOS
	public bool IsRecordingAvailable()
	{
		if (IsIosPlatform())
		{
			return _iosRecorder.IsRecorderAvailable();
		}

		return true;
	}

	// Only Work in IOS
	private void OnIosRecordStatus(bool isSuccess)
    {
		if (isSuccess)
		{
			Debug.Log("Unity>> Ios Record Started  ");
		}
		else
		{
			Debug.Log("Unity>> Ios Record Failed  ");
		}
		
	}

	public bool IsAndroidPlatform()
	{
		bool result = false;

#if UNITY_ANDROID && !UNITY_EDITOR
		result = true;
#endif

		return result;
	}

	public bool IsIosPlatform()
	{
		bool result = false;

#if UNITY_IPHONE && !UNITY_EDITOR
		result = true;
#endif

		return result;
	}


}
