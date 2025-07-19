using UnityEngine;

public class PanelManager : MonoBehaviour
{
    // Panels to show/hide
    public GameObject panel1, panel2;

    // Button actions to show panels
    public void ShowPanel1()
    {
        panel1.SetActive(true);  // Show Panel 1
        panel2.SetActive(false); // Hide Panel 2
    }

    public void ShowPanel2()
    {
        panel2.SetActive(true);  // Show Panel 2
        panel1.SetActive(false); // Hide Panel 1
    }

    // Close actions for both panels
    public void ClosePanel1()
    {
        panel1.SetActive(false); // Hide Panel 1
    }

    public void ClosePanel2()
    {
        panel2.SetActive(false); // Hide Panel 2
    }
}
