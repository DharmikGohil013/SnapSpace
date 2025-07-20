using UnityEngine;
using UnityEngine.UI; // Required for UI components like buttons
using UnityEngine.SceneManagement; // Required for scene management

public class ARTextureManager : MonoBehaviour
{
    // AR object that will use the texture
    public Renderer objectRenderer;

    // Reference to the back button
    public Button backButton;

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

        // Set up the back button listener to go to Scene 1
        if (backButton != null)
        {
            backButton.onClick.AddListener(GoToScene1);
        }
    }

    // Method to load Scene 1
    void GoToScene1()
    {
        // Load Scene 1 (make sure Scene 1 is added to Build Settings)
        SceneManager.LoadScene(1);
    }
}
