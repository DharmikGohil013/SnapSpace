using UnityEngine;
using System.Collections;

public class WelcomePanelController : MonoBehaviour
{
    public GameObject welcomePanel; // Drag the panel here in Inspector
    public float showTime = 2f; // 2 seconds delay

    void Start()
    {
        StartCoroutine(HideWelcomePanelAfterDelay());
    }

    IEnumerator HideWelcomePanelAfterDelay()
    {
        welcomePanel.SetActive(true); // Show panel
        yield return new WaitForSeconds(showTime); // Wait 2 seconds
        welcomePanel.SetActive(false); // Hide panel
    }
}
