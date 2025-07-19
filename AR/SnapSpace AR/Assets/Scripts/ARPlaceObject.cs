using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARFoundation.Samples;

public class ARPlaceObject : MonoBehaviour
{
    [SerializeField]
    GameObject m_PrefabToPlace;

    [SerializeField]
    ARRaycastHitEventAsset m_RaycastHitEvent;

    GameObject m_SpawnedObject;
    Renderer m_PrefabRenderer;

    // Reference to PrefabControl for size and tiling changes
    public PrefabControl prefabControl;

    void OnEnable()
    {
        if (m_RaycastHitEvent != null)
            m_RaycastHitEvent.eventRaised += PlaceObjectAt;
    }

    void OnDisable()
    {
        if (m_RaycastHitEvent != null)
            m_RaycastHitEvent.eventRaised -= PlaceObjectAt;
    }

    void PlaceObjectAt(object sender, ARRaycastHit hitPose)
    {
        if (m_SpawnedObject == null)
        {
            m_SpawnedObject = Instantiate(m_PrefabToPlace, hitPose.pose.position, hitPose.pose.rotation, hitPose.trackable.transform.parent);
            m_PrefabRenderer = m_SpawnedObject.GetComponent<Renderer>();

            // Apply the size and tiling based on PrefabControl inputs
            ApplySizeAndTiling();
        }
        else
        {
            m_SpawnedObject.transform.position = hitPose.pose.position;
            m_SpawnedObject.transform.parent = hitPose.trackable.transform.parent;
            ApplySizeAndTiling();
        }
    }

    void ApplySizeAndTiling()
    {
        if (m_PrefabRenderer != null)
        {
            // Apply size based on the prefabControl input (width and height)
            float width = float.Parse(prefabControl.widthInputField.text);
            float height = float.Parse(prefabControl.heightInputField.text);
            m_PrefabRenderer.transform.localScale = new Vector3(width / 100f, height / 100f, 1f);  // Convert cm to Unity units

            // Apply tiling based on prefabControl input (tiling width and height)
            int tilingW = int.Parse(prefabControl.tilingWidthInputField.text);
            int tilingH = int.Parse(prefabControl.tilingHeightInputField.text);
            m_PrefabRenderer.material.SetTextureScale("_MainTex", new Vector2(tilingW, tilingH));
        }
    }
}
