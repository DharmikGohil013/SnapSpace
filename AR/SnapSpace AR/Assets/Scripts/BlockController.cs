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
        // Know More Logic
        knowMore1Btn.onClick.AddListener(() => popup1.SetActive(true));
        knowMore2Btn.onClick.AddListener(() => popup2.SetActive(true));

        // Close Popup
        closePopup1Btn.onClick.AddListener(() => popup1.SetActive(false));
        closePopup2Btn.onClick.AddListener(() => popup2.SetActive(false));

        // AR View Transfer
        arView1Btn.onClick.AddListener(() =>
        {
            ImageTransfer.textureToTransfer = block1Image;
            SceneManager.LoadScene(3);
        });

        arView2Btn.onClick.AddListener(() =>
        {
            ImageTransfer.textureToTransfer = block2Image;
            SceneManager.LoadScene(3);
        });
    }
}
