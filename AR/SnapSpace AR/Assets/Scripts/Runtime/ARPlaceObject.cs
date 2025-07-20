using UnityEngine;
using UnityEngine.UI;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

namespace UnityEngine.XR.ARFoundation.Samples
{
    /// <summary>
    /// Subscribes to an <see cref="ARRaycastHitEventAsset"/>. When the event is raised, the
    /// <see cref="prefabToPlace"/> is instantiated at, or moved to, the hit position.
    /// The material of the placed object can be changed through buttons.
    /// </summary>
    public class ARPlaceObject : MonoBehaviour
    {
        [SerializeField]
        [Tooltip("The prefab to be placed or moved.")]
        GameObject m_PrefabToPlace;

        [SerializeField]
        [Tooltip("The Scriptable Object Asset that contains the ARRaycastHit event.")]
        ARRaycastHitEventAsset m_RaycastHitEvent;

        [SerializeField]
        [Tooltip("Array of materials to assign to the placed object.")]
        Material[] m_Materials;

        [SerializeField]
        [Tooltip("The buttons that trigger material change.")]
        Button[] m_Buttons;

        GameObject m_SpawnedObject;

        /// <summary>
        /// The prefab to be placed or moved.
        /// </summary>
        public GameObject prefabToPlace
        {
            get => m_PrefabToPlace;
            set => m_PrefabToPlace = value;
        }

        /// <summary>
        /// The spawned prefab instance.
        /// </summary>
        public GameObject spawnedObject
        {
            get => m_SpawnedObject;
            set => m_SpawnedObject = value;
        }

        void OnEnable()
        {
            if (m_RaycastHitEvent == null || m_PrefabToPlace == null)
            {
                Debug.LogWarning($"{nameof(ARPlaceObject)} component on {name} has null inputs and will have no effect in this scene.", this);
                return;
            }

            if (m_RaycastHitEvent != null)
                m_RaycastHitEvent.eventRaised += PlaceObjectAt;

            // Assign listeners to buttons to change materials
            for (int i = 0; i < m_Buttons.Length; i++)
            {
                int index = i; // Capture the current index for button material assignment
                m_Buttons[i].onClick.AddListener(() => ChangeMaterial(index));
            }
        }

        void OnDisable()
        {
            if (m_RaycastHitEvent != null)
                m_RaycastHitEvent.eventRaised -= PlaceObjectAt;

            // Remove button listeners
            for (int i = 0; i < m_Buttons.Length; i++)
            {
                m_Buttons[i].onClick.RemoveListener(() => ChangeMaterial(i));
            }
        }

        void PlaceObjectAt(object sender, ARRaycastHit hitPose)
        {
            if (m_SpawnedObject == null)
            {
                m_SpawnedObject = Instantiate(m_PrefabToPlace, hitPose.pose.position, hitPose.pose.rotation, hitPose.trackable.transform.parent);
            }
            else
            {
                m_SpawnedObject.transform.position = hitPose.pose.position;
                m_SpawnedObject.transform.parent = hitPose.trackable.transform.parent;
            }
        }

        // Method to change material of the spawned object
        void ChangeMaterial(int index)
        {
            if (m_SpawnedObject != null && index >= 0 && index < m_Materials.Length)
            {
                Renderer renderer = m_SpawnedObject.GetComponent<Renderer>();
                if (renderer != null)
                {
                    // Set the material to the selected one
                    renderer.material = m_Materials[index];
                    // Ensure that the material change is continuous by updating in real-time
                    Debug.Log($"Material updated to: {m_Materials[index].name}");
                }
            }
            else
            {
                Debug.LogWarning("Invalid material index or no spawned object.");
            }
        }
    }
}
