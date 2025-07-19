using UnityEngine;
using UnityEngine.UI;

public class TileBlock : MonoBehaviour
{
    public Text tileNameText;
    public Text materialText;
    public Text sizeText;
    public Text priceText;
    public Button viewDetailsButton;

    public void SetTileData(TileData tile)
    {
        tileNameText.text = tile.tileName;
        materialText.text = tile.material;
        sizeText.text = tile.size;
        priceText.text = "$" + tile.price.ToString("F2");
    }
}
