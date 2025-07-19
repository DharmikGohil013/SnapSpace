using UnityEngine;
using UnityEngine.SceneManagement;

public class ARButtonManager : MonoBehaviour
{
    // Define the textures for each button
    public Texture texture1;
    public Texture texture2;
    public Texture texture3;
    public Texture texture4;

    // Method to handle button clicks and pass the correct texture
    public void OnButton1Click()
    {
        // Store the texture in PlayerPrefs to persist between scenes
        PlayerPrefs.SetString("arTexture", "Texture1");
        PlayerPrefs.Save();

        // Transition to the AR scene
        SceneManager.LoadScene("Single_home_1");  // Replace with the name of your AR scene
    }

    public void OnButton2Click()
    {
        PlayerPrefs.SetString("arTexture", "Texture2");
        PlayerPrefs.Save();
        SceneManager.LoadScene("Single_home_1");  // Replace with your AR scene name
    }

    public void OnButton3Click()
    {
        PlayerPrefs.SetString("arTexture", "Texture3");
        PlayerPrefs.Save();
        SceneManager.LoadScene("Single_home_1 1");  // Replace with your AR scene name
    }

    public void OnButton4Click()
    {
        PlayerPrefs.SetString("arTexture", "Texture4");
        PlayerPrefs.Save();
        SceneManager.LoadScene("Single_home_1 1");  // Replace with your AR scene name
    }
}
