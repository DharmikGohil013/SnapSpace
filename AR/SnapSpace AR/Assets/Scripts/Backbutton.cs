using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class Backbutton : MonoBehaviour
{
    // Reference to the back button
    public Button backButton;

    void Start()
    {
        // Ensure the back button is assigned
        if (backButton != null)
        {
            backButton.onClick.AddListener(GoToScene1); // Add listener to go to Scene 1
        }
        else
        {
            Debug.LogWarning("Back Button is not assigned in the Inspector.");
        }
    }

    // Method to load Scene 1
    void GoToScene1()
    {
        // Load Scene 1 (make sure Scene 1 is added to Build Settings)
        SceneManager.LoadScene("Scene1");
    }
}
