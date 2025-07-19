using UnityEngine;

public class ApplyTextureToPrefab : MonoBehaviour
{
    public Renderer targetRenderer;

    void Start()
    {
        if (ImageTransfer.textureToTransfer != null && targetRenderer != null)
        {
            targetRenderer.material.mainTexture = ImageTransfer.textureToTransfer;
        }
    }
}
