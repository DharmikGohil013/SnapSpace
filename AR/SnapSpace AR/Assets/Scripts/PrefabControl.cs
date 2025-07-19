using UnityEngine;
using UnityEngine.UI;

public class PrefabControl : MonoBehaviour
{
    // UI Elements
    public InputField widthInputField;   // For width input (in cm)
    public InputField heightInputField;  // For height input (in cm)
    public InputField tilingWidthInputField;   // For tiling width
    public InputField tilingHeightInputField;  // For tiling height

    public Button sizeUpButton;  // Button to increase size
    public Button sizeDownButton;  // Button to decrease size
    public Button tilingUpButton;  // Button to increase tiling
    public Button tilingDownButton;  // Button to decrease tiling

    public Button sizeButton;  // Button to apply size change
    public Button tilingButton;  // Button to apply tiling change

    public GameObject prefab;   // The prefab that contains the "Plane" child
    private Renderer planeRenderer;  // Renderer of the "Plane" child object
    private PrefabManager prefabManager;  // Reference to PrefabManager script

    // Default Values
    private const float defaultWidth = 20f; // Default width in cm (20 cm)
    private const float defaultHeight = 20f; // Default height in cm (20 cm)
    private const int defaultTilingW = 1; // Default tiling width (1)
    private const int defaultTilingH = 1; // Default tiling height (1)

    // Limits for tiling
    private const int minTiling = 20; // Minimum tiling value
    private const int maxTiling = 300; // Maximum tiling value

    // Limits for width/height increments (10 cm per click)
    private const int sizeIncrement = 10;

    // New Fields for Custom Material and Texture
    public Material customMaterial; // Custom material to apply
    public Texture customTexture;   // Custom texture to apply
    public Vector2 customTiling = new Vector2(1f, 1f); // Custom tiling for the texture

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

        // Get the PrefabManager component from the prefab
        prefabManager = prefab.GetComponent<PrefabManager>();

        // Set default values initially for input fields
        widthInputField.text = defaultWidth.ToString();
        heightInputField.text = defaultHeight.ToString();
        tilingWidthInputField.text = defaultTilingW.ToString();
        tilingHeightInputField.text = defaultTilingH.ToString();

        // Add listeners for buttons
        sizeButton.onClick.AddListener(ApplySize);
        tilingButton.onClick.AddListener(ApplyTiling);

        sizeUpButton.onClick.AddListener(SizeUp);
        sizeDownButton.onClick.AddListener(SizeDown);
        tilingUpButton.onClick.AddListener(TilingUp);
        tilingDownButton.onClick.AddListener(TilingDown);
    }

    // Function to apply size changes to the "Plane" child
    void ApplySize()
    {
        // Get width and height from the input fields (parse to float)
        float width = float.Parse(widthInputField.text);
        float height = float.Parse(heightInputField.text);

        // Apply the size to the "Plane" child through PrefabManager
        prefabManager.SetDefaultSize(width, height);
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

    // Function to increase size (width and height) by 10
    void SizeUp()
    {
        float width = float.Parse(widthInputField.text);
        float height = float.Parse(heightInputField.text);

        // Increase size by 10 for both width and height
        width += sizeIncrement;
        height += sizeIncrement;

        // Update input fields with new values
        widthInputField.text = width.ToString();
        heightInputField.text = height.ToString();

        ApplySize();
    }

    // Function to decrease size (width and height) by 10
    void SizeDown()
    {
        float width = float.Parse(widthInputField.text);
        float height = float.Parse(heightInputField.text);

        // Decrease size by 10 for both width and height
        width -= sizeIncrement;
        height -= sizeIncrement;

        // Update input fields with new values
        widthInputField.text = width.ToString();
        heightInputField.text = height.ToString();

        ApplySize();
    }

    // Function to increase tiling by 1 (with limits of 20 to 300)
    void TilingUp()
    {
        int tilingW = int.Parse(tilingWidthInputField.text);
        int tilingH = int.Parse(tilingHeightInputField.text);

        // Increase tiling by 1, but within the limit (20 to 300)
        if (tilingW < maxTiling)
        {
            tilingW++;
            tilingWidthInputField.text = tilingW.ToString();
        }
        if (tilingH < maxTiling)
        {
            tilingH++;
            tilingHeightInputField.text = tilingH.ToString();
        }

        ApplyTiling();
    }

    // Function to decrease tiling by 1 (with limits of 20 to 300)
    void TilingDown()
    {
        int tilingW = int.Parse(tilingWidthInputField.text);
        int tilingH = int.Parse(tilingHeightInputField.text);

        // Decrease tiling by 1, but within the limit (20 to 300)
        if (tilingW > minTiling)
        {
            tilingW--;
            tilingWidthInputField.text = tilingW.ToString();
        }
        if (tilingH > minTiling)
        {
            tilingH--;
            tilingHeightInputField.text = tilingH.ToString();
        }

        ApplyTiling();
    }

    // Function to apply custom material and texture to the prefab in AR
    public void ApplyCustomMaterialAndTexture(GameObject spawnedPrefab)
    {
        if (spawnedPrefab != null)
        {
            Renderer prefabRenderer = spawnedPrefab.GetComponent<Renderer>();
            if (prefabRenderer != null)
            {
                // Apply custom material
                if (customMaterial != null)
                {
                    prefabRenderer.material = customMaterial;
                }

                // Apply custom texture
                if (customTexture != null)
                {
                    prefabRenderer.material.mainTexture = customTexture;
                }

                // Apply tiling to the main texture
                prefabRenderer.material.SetTextureScale("_MainTex", customTiling);
            }
        }
        else
        {
            Debug.LogError("Prefab is null. Cannot apply material and texture.");
        }
    }
}
