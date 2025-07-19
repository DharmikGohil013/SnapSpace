using UnityEngine;
using UnityEngine.UI;

public class NavigationControllerRaw : MonoBehaviour
{
    [Header("Panels")]
    public GameObject homePanel;
    public GameObject tilesPanel;
    public GameObject arPanel;  // AR Panel instead of Settings Panel
    public GameObject profilePanel;
    public GameObject cartPanel;

    [Header("Buttons")]
    public Button homeButton;
    public Button tilesButton;
    public Button arButton;  // AR Button instead of Settings Button
    public Button profileButton;
    public Button cartButton;

    [Header("Raw Image Icons")]
    public RawImage homeIcon;
    public RawImage tilesIcon;
    public RawImage arIcon;  // AR Icon instead of Settings Icon
    public RawImage profileIcon;
    public RawImage cartIcon;

    private Color activeColor = Color.blue;
    private Color inactiveColor = Color.white;

    void Start()
    {
        // Set default panel
        ShowPanel("Home");

        // Assign button listeners
        homeButton.onClick.AddListener(() => ShowPanel("Home"));
        tilesButton.onClick.AddListener(() => ShowPanel("Tiles"));
        arButton.onClick.AddListener(() => ShowPanel("AR"));  // AR Button Listener
        profileButton.onClick.AddListener(() => ShowPanel("Profile"));
        cartButton.onClick.AddListener(() => ShowPanel("Cart"));
    }

    void ShowPanel(string panelName)
    {
        // Show the selected panel, hide others
        homePanel.SetActive(panelName == "Home");
        tilesPanel.SetActive(panelName == "Tiles");
        arPanel.SetActive(panelName == "AR");  // Show AR Panel
        profilePanel.SetActive(panelName == "Profile");
        cartPanel.SetActive(panelName == "Cart");

        // Update RawImage icon colors
        homeIcon.color = (panelName == "Home") ? activeColor : inactiveColor;
        tilesIcon.color = (panelName == "Tiles") ? activeColor : inactiveColor;
        arIcon.color = (panelName == "AR") ? activeColor : inactiveColor;  // Update AR Icon Color
        profileIcon.color = (panelName == "Profile") ? activeColor : inactiveColor;
        cartIcon.color = (panelName == "Cart") ? activeColor : inactiveColor;
    }
}
