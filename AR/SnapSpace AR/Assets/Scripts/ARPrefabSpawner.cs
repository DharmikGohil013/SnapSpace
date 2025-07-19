using UnityEngine;

public class ARPrefabSpawner : MonoBehaviour
{
    public GameObject prefab; // Reference to the prefab to be placed in AR
    public Material defaultMaterial; // Material to apply to the prefab
    public Texture defaultTexture; // Default texture for the prefab
    public Vector2 defaultTiling = new Vector2(1f, 1f); // Default tiling for the prefab

    void Start()
    {
        // Instantiate the prefab in the AR world (set the position and rotation)
        GameObject instantiatedPrefab = Instantiate(prefab, new Vector3(0, 0, 0), Quaternion.identity);

        // Access the PrefabManager script from the instantiated prefab
        PrefabManager prefabManager = instantiatedPrefab.GetComponent<PrefabManager>();

        if (prefabManager != null)
        {
            // Apply texture and tiling to the instantiated prefab
            prefabManager.SetDefaultTexture(defaultTexture);
            prefabManager.SetDefaultTiling(defaultTiling);
        }
        else
        {
            Debug.LogError("PrefabManager not found on instantiated prefab.");
        }
    }
}
