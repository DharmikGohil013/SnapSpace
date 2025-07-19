using UnityEngine;

public class PanelToggle : MonoBehaviour
{
    public GameObject panel; // Assign in Inspector

    void Start()
    {
        // Hide the panel at the start
        if (panel != null)
            panel.SetActive(false);
    }

    public void TogglePanel()
    {
        if (panel != null)
            panel.SetActive(!panel.activeSelf); // Toggle visibility
    }
}
