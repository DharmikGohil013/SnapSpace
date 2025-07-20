using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class TwoButtonSceneSwitcher : MonoBehaviour
{
    public Button buttonSceneA;
    public Button buttonSceneB;

    // Assign these scene names in the inspector
    public string sceneNameA;
    public string sceneNameB;

    void Start()
    {
        buttonSceneA.onClick.AddListener(() => LoadScene(sceneNameA));
        buttonSceneB.onClick.AddListener(() => LoadScene(sceneNameB));
    }

    void LoadScene(string sceneName)
    {
        if (!string.IsNullOrEmpty(sceneName))
        {
            SceneManager.LoadScene(sceneName);
        }
        else
        {
            Debug.LogError("Scene name is not set or is empty.");
        }
    }
}
