using UnityEngine;

public class PrefabManager : MonoBehaviour
{
    [Header("Prefab Settings")]
    [SerializeField] private Texture defaultTexture; // Default texture for the prefab
    [SerializeField] private float defaultWidth = 20f; // Default width in cm
    [SerializeField] private float defaultHeight = 20f; // Default height in cm
    [SerializeField] private Material materialToApply; // Reference to the material to which the texture will be applied
    [SerializeField] private Vector2 defaultTiling = new Vector2(1f, 1f); // Default tiling (1x1)
    [SerializeField] private Vector2 defaultSecondaryTiling = new Vector2(1f, 1f); // Default tiling for secondary texture (like normal map)

    private Renderer prefabRenderer;

    void Start()
    {
        // Get the renderer component from the prefab
        prefabRenderer = GetComponent<Renderer>();

        // Apply the default texture, tiling, and size
        ApplyTexture(defaultTexture);
        ApplyTiling(defaultTiling);
        ApplySecondaryTiling(defaultSecondaryTiling);
        ApplySize(defaultWidth, defaultHeight);
    }

    // Function to apply texture to the prefab's material
    public void ApplyTexture(Texture texture)
    {
        // Ensure we are using an instance material to prevent changes affecting other objects
        if (materialToApply != null)
        {
            prefabRenderer.material.mainTexture = texture; // Apply the texture to the specific material
        }
        else
        {
            Debug.LogError("Material not found. Please assign a material to 'materialToApply'.");
        }
    }

    // Function to apply tiling to the prefab's material
    public void ApplyTiling(Vector2 tiling)
    {
        // Ensure we are using an instance material to prevent changes affecting other objects
        if (materialToApply != null)
        {
            prefabRenderer.material.SetTextureScale("_MainTex", tiling); // Apply tiling for main texture
        }
        else
        {
            Debug.LogError("Material not found. Please assign a material to 'materialToApply'.");
        }
    }

    // Function to apply tiling to the secondary texture (e.g., normal map)
    public void ApplySecondaryTiling(Vector2 tiling)
    {
        // Ensure we are using an instance material to prevent changes affecting other objects
        if (materialToApply != null)
        {
            prefabRenderer.material.SetTextureScale("_BumpMap", tiling); // Apply tiling for the bump map (secondary texture)
        }
        else
        {
            Debug.LogError("Material not found. Please assign a material to 'materialToApply'.");
        }
    }

    // Function to apply size to the prefab
    public void ApplySize(float width, float height)
    {
        if (prefabRenderer != null)
        {
            // Convert from cm to Unity units (1 unit = 1 meter)
            prefabRenderer.transform.localScale = new Vector3(width / 100f, height / 100f, 1f);
        }
        else
        {
            Debug.LogError("Prefab's Renderer not found.");
        }
    }

    // Set texture directly from PrefabControl
    public void SetDefaultSize(float width, float height)
    {
        ApplySize(width, height);
    }

    // Set texture directly from PrefabControl
    public void SetDefaultTexture(Texture texture)
    {
        ApplyTexture(texture);
    }

    // Set tiling directly from PrefabControl
    public void SetDefaultTiling(Vector2 tiling)
    {
        ApplyTiling(tiling);
    }

    // Set secondary tiling directly from PrefabControl
    public void SetDefaultSecondaryTiling(Vector2 tiling)
    {
        ApplySecondaryTiling(tiling);
    }
}
