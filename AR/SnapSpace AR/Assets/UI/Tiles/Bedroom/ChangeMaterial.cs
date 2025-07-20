using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement; // Import for scene management

public class ChangeMaterial : MonoBehaviour
{
    // List of Materials (Assign your materials in the Unity Inspector)
    public Material[] materials; // 5 Materials, each with a different texture

    // The ARPlacedCube prefab that contains the Cube object
    public GameObject arPlacedCube;

    // The buttons that trigger material change
    public Button[] buttons;

    // Back button to navigate to Scene 1
    public Button backButton;

    private MeshRenderer cubeRenderer;

    void Start()
    {
        // Get the MeshRenderer component of the ARPlacedCube (child Cube)
        cubeRenderer = arPlacedCube.GetComponentInChildren<MeshRenderer>();

        // Ensure each button calls the SetMaterial function with the corresponding material
        for (int i = 0; i < buttons.Length; i++)
        {
            int index = i; // Capture the current index
            buttons[i].onClick.AddListener(() => SetMaterial(index)); // Add button click listener
        }

        // Set up the back button to load Scene 1 when clicked
        backButton.onClick.AddListener(GoToScene1);
    }

    // Set the material of the cube based on button press
    public void SetMaterial(int index)
    {
        if (index >= 0 && index < materials.Length)
        {
            // Assign the material to the cube's MeshRenderer
            cubeRenderer.material = materials[index];
        }
        else
        {
            Debug.LogWarning("Invalid material index!");
        }
    }

    // Method to load Scene 1
    public void GoToScene1()
    {
        // Load Scene 1 (Make sure the scene name is correct, and it's added to build settings)
        SceneManager.LoadScene(1);
    }
}
