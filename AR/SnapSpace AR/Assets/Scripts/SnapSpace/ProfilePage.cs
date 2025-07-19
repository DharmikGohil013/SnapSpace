using UnityEngine;
using UnityEngine.UI;
using TMPro;
using UnityEngine.SceneManagement;

public class ProfilePage : MonoBehaviour
{
    [Header("UI Elements")]
    public TMP_Text userNameText;
    public Button logoutButton;

    private string userNameKey = "snapspace_username";

    void Start()
    {
        // Get the user name from PlayerPrefs (set this after login/signup)
        string userName = PlayerPrefs.GetString(userNameKey, "User");
        userNameText.text = userName;

        logoutButton.onClick.AddListener(OnLogoutClicked);
    }

    void OnLogoutClicked()
    {
        PlayerPrefs.DeleteAll(); // Remove all saved data (including token and username)
        PlayerPrefs.Save();
        SceneManager.LoadScene(0); // Go to login/signup scene
    }
}