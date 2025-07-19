using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneSwitcher : MonoBehaviour
{
    public void LoadExampleScene()
    {
        // Replace with your actual scene name or index
        SceneManager.LoadScene("Example Scene");
        // OR use index like SceneManager.LoadScene(1);
    }

    public void LoadOtherScene()
    {
        // Replace with the other scene name or index
        SceneManager.LoadScene("MainScene");
        // OR use index like SceneManager.LoadScene(0);
    }
}
