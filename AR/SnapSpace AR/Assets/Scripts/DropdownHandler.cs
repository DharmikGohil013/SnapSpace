using UnityEngine;
using TMPro;

public class DropdownHandler : MonoBehaviour
{
    public TMP_Dropdown dropdown;

    void Start()
    {
        // Optionally populate items in code
        dropdown.ClearOptions();
        dropdown.AddOptions(new System.Collections.Generic.List<string> { "Option A", "Option B", "Option C" });

        // Listen to value change
        dropdown.onValueChanged.AddListener(delegate {
            OnDropdownValueChanged(dropdown);
        });
    }

    void OnDropdownValueChanged(TMP_Dropdown change)
    {
        Debug.Log("Selected: " + change.options[change.value].text);
        // Handle logic here
    }
}
