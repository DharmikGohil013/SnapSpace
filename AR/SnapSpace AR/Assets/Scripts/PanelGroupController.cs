using UnityEngine;

public class PanelGroupController : MonoBehaviour
{
    public GameObject[] panels; // Assign all 6 panels in Inspector

    void Start()
    {
        ShowPanel(0); // Show the first panel by default
    }

    public void ShowPanel(int index)
    {
        for (int i = 0; i < panels.Length; i++)
        {
            panels[i].SetActive(i == index); // Show selected, hide others
        }
    }
}
