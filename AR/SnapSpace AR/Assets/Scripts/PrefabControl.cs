using UnityEngine;
using UnityEngine.UI;

public class PrefabControl : MonoBehaviour
{
    // UI Elements
    public InputField widthInputField;   // For width input (in cm)
    public InputField heightInputField;  // For height input (in cm)
    public InputField tilingWidthInputField;   // For tiling width
    public InputField tilingHeightInputField;  // For tiling height

    public Button sizeButton;  // Button to apply size change
    public Button tilingButton;  // Button to apply tiling change

    public GameObject prefab;   // The prefab that contains the "Plane" child
    private Renderer planeRenderer;  // Renderer of the "Plane" child object

    // Default Values
    private const float defaultWidth = 60f; // Default width in cm
    private const float defaultHeight = 60f; // Default height in cm
    private const int defaultTilingW = 1; // Default tiling width
    private const int defaultTilingH = 1; // Default tiling height

    void Start()
    {
        // Find the "Plane" child object within the prefab
        Transform planeTransform = prefab.transform.Find("Plane");  // Search for "Plane" child
        if (planeTransform != null)
        {
            planeRenderer = planeTransform.GetComponent<Renderer>();  // Get the renderer of "Plane"
        }
        else
        {
            Debug.LogError("No child named 'Plane' found in prefab.");
        }

        // Set default values initially for input fields
        widthInputField.text = defaultWidth.ToString();
        heightInputField.text = defaultHeight.ToString();
        tilingWidthInputField.text = defaultTilingW.ToString();
        tilingHeightInputField.text = defaultTilingH.ToString();

        // Add listeners for buttons
        sizeButton.onClick.AddListener(ApplySize);
        tilingButton.onClick.AddListener(ApplyTiling);
    }

    // Function to apply size changes to the "Plane" child
    void ApplySize()
    {
        // Get width and height from the input fields (parse to float)
        float width = float.Parse(widthInputField.text);
        float height = float.Parse(heightInputField.text);

        // Apply the width and height to the "Plane" child (convert cm to Unity units)
        if (planeRenderer != null)
        {
            planeRenderer.transform.localScale = new Vector3(width / 100f, height / 100f, 1f);
        }
        else
        {
            Debug.LogError("Plane renderer not found.");
        }
    }

    // Function to apply tiling changes to the "Plane" child's material
    void ApplyTiling()
    {
        // Get tiling width and height from the input fields (parse to int)
        int tilingW = int.Parse(tilingWidthInputField.text);
        int tilingH = int.Parse(tilingHeightInputField.text);

        // Apply the tiling to the "Plane" child's material
        if (planeRenderer != null && planeRenderer.material != null)
        {
            planeRenderer.material.SetTextureScale("_MainTex", new Vector2(tilingW, tilingH));
        }
        else
        {
            Debug.LogError("Plane renderer or material not found.");
        }
    }

    // Optional: Reset to default values
    public void ResetToDefaults()
    {
        widthInputField.text = defaultWidth.ToString();
        heightInputField.text = defaultHeight.ToString();
        tilingWidthInputField.text = defaultTilingW.ToString();
        tilingHeightInputField.text = defaultTilingH.ToString();

        ApplySize(); // Apply default size
        ApplyTiling(); // Apply default tiling
    }
}
