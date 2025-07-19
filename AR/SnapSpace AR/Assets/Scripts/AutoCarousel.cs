using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class AutoCarousel : MonoBehaviour
{
    public ScrollRect scrollRect;
    public int imageCount = 5;
    public float scrollInterval = 2f; // 2 seconds
    private int currentIndex = 0;
    private float targetPos;
    private bool isScrolling = false;

    void Start()
    {
        if (scrollRect != null)
        {
            StartCoroutine(AutoScroll());
        }
    }

    IEnumerator AutoScroll()
    {
        while (true)
        {
            yield return new WaitForSeconds(scrollInterval);

            currentIndex++;
            if (currentIndex >= imageCount)
                currentIndex = 0;

            targetPos = (float)currentIndex / (imageCount - 1); // normalized position

            StartCoroutine(SmoothScrollTo(targetPos));
        }
    }

    IEnumerator SmoothScrollTo(float target)
    {
        isScrolling = true;
        float duration = 0.5f;
        float elapsed = 0f;
        float start = scrollRect.horizontalNormalizedPosition;

        while (elapsed < duration)
        {
            scrollRect.horizontalNormalizedPosition = Mathf.Lerp(start, target, elapsed / duration);
            elapsed += Time.deltaTime;
            yield return null;
        }

        scrollRect.horizontalNormalizedPosition = target;
        isScrolling = false;
    }
}
