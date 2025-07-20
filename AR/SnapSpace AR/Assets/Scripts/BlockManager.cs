using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class BlockManager : MonoBehaviour
{
    // Prefabs for the block and the save item in the save panel
    public GameObject blockPrefab;
    public GameObject saveItemPrefab;
    public GameObject savePanel; // The Save Panel (ScrollView content)

    // Array to store block data
    private List<BlockData> blocks = new List<BlockData>();

    // Data structure for each block
    [System.Serializable]
    public class BlockData
    {
        public string blockName;
        public Sprite blockImage;
        public Button saveButton; // Save button for each block
    }

    // Call this function to create and display new blocks dynamically
    public void CreateBlock(string name, Sprite image)
    {
        // Create new block data object
        BlockData newBlock = new BlockData
        {
            blockName = name,
            blockImage = image
        };

        // Store the block data in the list
        blocks.Add(newBlock);

        // Call method to display the block with a Save button
        DisplayBlock(newBlock);
    }

    // Display block in the UI with Save button
    private void DisplayBlock(BlockData blockData)
    {
        // Instantiate block prefab
        GameObject newBlock = Instantiate(blockPrefab, transform);

        // Set block name and image
        newBlock.GetComponentInChildren<TextMeshProUGUI>().text = blockData.blockName;
        newBlock.GetComponentInChildren<Image>().sprite = blockData.blockImage;

        // Get the Save button and assign the OnClick event
        Button saveButton = newBlock.transform.Find("SaveButton").GetComponent<Button>();
        blockData.saveButton = saveButton;

        // Add OnClick listener to save this block when pressed
        saveButton.onClick.AddListener(() => OnSaveButtonClicked(blockData));
    }

    // Called when the "Save" button is clicked
    private void OnSaveButtonClicked(BlockData blockData)
    {
        // Instantiate the saved item prefab and set its content (same as the block)
        GameObject savedItem = Instantiate(saveItemPrefab, savePanel.transform);

        // Set the saved block's name and image
        savedItem.GetComponentInChildren<TextMeshProUGUI>().text = blockData.blockName;
        savedItem.GetComponentInChildren<Image>().sprite = blockData.blockImage;

        // Optionally, you could add a Remove button here to remove items from the save panel
    }
}
