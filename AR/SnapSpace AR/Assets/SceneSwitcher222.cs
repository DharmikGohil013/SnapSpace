using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class SceneSwitcher222 : MonoBehaviour
{
    public Button[] buttons;

    void Start()
    {
        if (buttons.Length != 28)
        {
            Debug.LogError("You need to assign exactly 28 buttons in the Inspector.");
            return;
        }

        for (int i = 0; i < buttons.Length; i++)
        {
            int sceneIndex = i + 5; // Auto assign from Scene5 to Scene32
            buttons[i].onClick.AddListener(() => LoadScene(sceneIndex));
        }
    }

    public void LoadScene(int sceneIndex)
    {
        if (sceneIndex >= 5 && sceneIndex <= 32)
        {
            SceneManager.LoadScene(sceneIndex);
        }
        else
        {
            Debug.LogError("Scene index out of range. Must be between 5 and 32.");
        }
    }
}