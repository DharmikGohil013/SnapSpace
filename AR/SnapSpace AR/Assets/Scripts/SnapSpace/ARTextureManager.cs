using UnityEngine;

public class ARTextureManager : MonoBehaviour
{
    // AR object that will use the texture
    public Renderer objectRenderer;

    void Start()
    {
        // Retrieve the texture name stored in PlayerPrefs
        string textureName = PlayerPrefs.GetString("arTexture", "");

        if (!string.IsNullOrEmpty(textureName))
        {
            // Apply the texture based on the stored name
            switch (textureName)
            {
                case "Texture1":
                    objectRenderer.material.mainTexture = Resources.Load<Texture>("Texture1");
                    break;
                case "Texture2":
                    objectRenderer.material.mainTexture = Resources.Load<Texture>("Texture2");
                    break;
                case "Texture3":
                    objectRenderer.material.mainTexture = Resources.Load<Texture>("Texture3");
                    break;
                case "Texture4":
                    objectRenderer.material.mainTexture = Resources.Load<Texture>("Texture4");
                    break;
            }
        }
    }
}
