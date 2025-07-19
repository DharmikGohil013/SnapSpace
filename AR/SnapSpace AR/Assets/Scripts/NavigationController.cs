using UnityEngine;
using UnityEngine.UI;

public class NavigationControllerRaw : MonoBehaviour
{
    [Header("Panels")]
    public GameObject homePanel;
    public GameObject tilesPanel;
    public GameObject settingsPanel;
    public GameObject profilePanel;

    [Header("Buttons")]
    public Button homeButton;
    public Button tilesButton;
    public Button settingsButton;
    public Button profileButton;

    [Header("Raw Image Icons")]
    public RawImage homeIcon;
    public RawImage tilesIcon;
    public RawImage settingsIcon;
    public RawImage profileIcon;

    private Color activeColor = Color.blue;
    private Color inactiveColor = Color.white;

    void Start()
    {
        // Set default panel
        ShowPanel("Home");

        // Assign button listeners
        homeButton.onClick.AddListener(() => ShowPanel("Home"));
        tilesButton.onClick.AddListener(() => ShowPanel("Tiles"));
        settingsButton.onClick.AddListener(() => ShowPanel("Settings"));
        profileButton.onClick.AddListener(() => ShowPanel("Profile"));
    }

    void ShowPanel(string panelName)
    {
        // Show the selected panel, hide others
        homePanel.SetActive(panelName == "Home");
        tilesPanel.SetActive(panelName == "Tiles");
        settingsPanel.SetActive(panelName == "Settings");
        profilePanel.SetActive(panelName == "Profile");

        // Update RawImage icon colors
        homeIcon.color = (panelName == "Home") ? activeColor : inactiveColor;
        tilesIcon.color = (panelName == "Tiles") ? activeColor : inactiveColor;
        settingsIcon.color = (panelName == "Settings") ? activeColor : inactiveColor;
        profileIcon.color = (panelName == "Profile") ? activeColor : inactiveColor;
    }
}
