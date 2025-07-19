using UnityEngine;
using UnityEngine.UI;
using TMPro; // Import TextMeshPro namespace
using System.Collections;
using UnityEngine.Networking;
using System.Collections.Generic;

public class TileManager : MonoBehaviour
{
    [Header("Tile UI Elements")]
    public GameObject tilePrefab; // Tile prefab to clone and display
    public Transform tilesContainer; // The container where the tiles will be displayed
    public GameObject tileDetailsPopup; // Popup to display tile details
    public TMP_Text tileNameText; // Changed to TMP_Text
    public TMP_Text tileMaterialText; // Changed to TMP_Text
    public TMP_Text tileSizeText; // Changed to TMP_Text
    public TMP_Text tilePriceText; // Changed to TMP_Text
    public TMP_Text tileDescriptionText; // Changed to TMP_Text

    [Header("Filter Buttons")]
    public Button kitchenButton;
    public Button bathroomButton;
    public Button balconyButton;
    public Button livingRoomButton;
    public Button elevationButton;
    public Button bedroomButton;

    private string filterCategory = ""; // Current filter category
    private string apiUrl = "https://https://snapspace-ry3k.onrender.com/api/tiles"; // API endpoint for tile data

    void Start()
    {
        // Assign button listeners for filtering tiles
        kitchenButton.onClick.AddListener(() => ApplyFilter("kitchen"));
        bathroomButton.onClick.AddListener(() => ApplyFilter("bathroom"));
        balconyButton.onClick.AddListener(() => ApplyFilter("balcony"));
        livingRoomButton.onClick.AddListener(() => ApplyFilter("livingRoom"));
        elevationButton.onClick.AddListener(() => ApplyFilter("elevation"));
        bedroomButton.onClick.AddListener(() => ApplyFilter("bedroom"));

        // Fetch all tiles initially
        StartCoroutine(FetchTileData());
    }

    // Function to fetch tile data from the server
    IEnumerator FetchTileData()
    {
        string url = filterCategory == "" ? apiUrl : $"{apiUrl}?category={filterCategory}"; // Add filter query if needed
        UnityWebRequest request = UnityWebRequest.Get(url);

        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            // Parse the tile data from the server response (assuming JSON format)
            TileData[] tiles = JsonHelper.FromJson<TileData>(request.downloadHandler.text);

            // Clear existing tiles
            foreach (Transform child in tilesContainer)
            {
                Destroy(child.gameObject);
            }

            // Create tiles dynamically from the fetched data
            foreach (TileData tile in tiles)
            {
                GameObject tileObj = Instantiate(tilePrefab, tilesContainer);
                TileBlock tileBlock = tileObj.GetComponent<TileBlock>();

                // Set tile data on the prefab
                tileBlock.SetTileData(tile);

                // Add listener for the "View Details" button
                tileBlock.viewDetailsButton.onClick.AddListener(() => ShowTileDetails(tile));
            }
        }
        else
        {
            Debug.LogError("Error fetching tiles: " + request.error);
        }
    }

    // Apply filter based on category
    void ApplyFilter(string category)
    {
        filterCategory = category;
        StartCoroutine(FetchTileData()); // Fetch filtered data
    }

    // Show tile details in the popup
    void ShowTileDetails(TileData tile)
    {
        tileDetailsPopup.SetActive(true); // Show popup
        tileNameText.text = "Name: " + tile.tileName;
        tileMaterialText.text = "Material: " + tile.material;
        tileSizeText.text = "Size: " + tile.size;
        tilePriceText.text = "Price: " + tile.price.ToString("C");
        tileDescriptionText.text = "Description: " + tile.description;
    }
}

// Class to represent each tile's data
[System.Serializable]
public class TileData
{
    public string tileName;
    public string description;
    public string companyName;
    public float price;
    public float thickness;
    public string size;
    public string stroke;
    public string usageArea;
    public string material;
}

// Helper class to handle JSON parsing of an array
public static class JsonHelper
{
    public static T[] FromJson<T>(string json)
    {
        string arrayJson = "{\"array\":" + json + "}";
        Wrapper<T> wrapper = JsonUtility.FromJson<Wrapper<T>>(arrayJson);
        return wrapper.array;
    }

    [System.Serializable]
    private class Wrapper<T>
    {
        public T[] array;
    }
}
