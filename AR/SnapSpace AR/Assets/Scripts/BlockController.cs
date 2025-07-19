using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class BlockController : MonoBehaviour
{
    [Header("Popups")]
    public GameObject popup1;
    public GameObject popup2;

    [Header("Block 1 Settings")]
    public Button knowMore1Btn;
    public Button arView1Btn;
    public Texture block1Image;

    [Header("Block 2 Settings")]
    public Button knowMore2Btn;
    public Button arView2Btn;
    public Texture block2Image;

    [Header("Close Buttons")]
    public Button closePopup1Btn;
    public Button closePopup2Btn;

    void Start()
    {
        // Null checks for all public fields
        if (knowMore1Btn == null) Debug.LogError("BlockController: knowMore1Btn is not assigned.");
        if (knowMore2Btn == null) Debug.LogError("BlockController: knowMore2Btn is not assigned.");
        if (popup1 == null) Debug.LogError("BlockController: popup1 is not assigned.");
        if (popup2 == null) Debug.LogError("BlockController: popup2 is not assigned.");
        if (closePopup1Btn == null) Debug.LogError("BlockController: closePopup1Btn is not assigned.");
        if (closePopup2Btn == null) Debug.LogError("BlockController: closePopup2Btn is not assigned.");
        if (arView1Btn == null) Debug.LogError("BlockController: arView1Btn is not assigned.");
        if (arView2Btn == null) Debug.LogError("BlockController: arView2Btn is not assigned.");

        // Only add listeners if not null
        if (knowMore1Btn != null && popup1 != null)
            knowMore1Btn.onClick.AddListener(() => popup1.SetActive(true));
        if (knowMore2Btn != null && popup2 != null)
            knowMore2Btn.onClick.AddListener(() => popup2.SetActive(true));

        if (closePopup1Btn != null && popup1 != null)
            closePopup1Btn.onClick.AddListener(() => popup1.SetActive(false));
        if (closePopup2Btn != null && popup2 != null)
            closePopup2Btn.onClick.AddListener(() => popup2.SetActive(false));

        if (arView1Btn != null)
            arView1Btn.onClick.AddListener(() =>
            {
                ImageTransfer.textureToTransfer = block1Image;
                SceneManager.LoadScene(3);
            });
        if (arView2Btn != null)
            arView2Btn.onClick.AddListener(() =>
            {
                ImageTransfer.textureToTransfer = block2Image;
                SceneManager.LoadScene(3);
            });
    }
}
