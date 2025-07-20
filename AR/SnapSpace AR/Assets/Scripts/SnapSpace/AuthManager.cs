using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;

public class AuthManager : MonoBehaviour
{
    [System.Serializable]
    public class OtpRequestBody
    {
        public string name;
        public string email;
        public string password;
    }

    [System.Serializable]
    public class VerifyOtpRequest
    {
        public string name;
        public string email;
        public string password;
        public string otp;
    }

    [System.Serializable]
    public class LoginResponse
    {
        public bool success;
        public string token;
    }

    //[Header("Panels")]
    public GameObject signupPanel, otpPanel, loginPanel, forgetPanel;

    [Header("Signup Fields")]
    public TMP_InputField signupName, signupEmail, signupPassword, signupOtp;

    [Header("Login Fields")]
    public TMP_InputField loginEmail, loginPassword;

    [Header("Forget Fields")]
    public TMP_InputField forgetEmail, forgetOtp, forgetNewPassword, forgetConfirmPassword;

    [Header("Error Texts")]
    public TMP_Text errorTextSignup, errorTextOtp, errorTextLogin, errorTextForget;

    [Header("Loading Indicator")]
    public GameObject loadingIndicator;

    private string BASE_URL = "https://snapspace-ry3k.onrender.com/api";
    private string cachedSignupName, cachedSignupEmail, cachedSignupPassword;

    void Start()
    {
        string token = PlayerPrefs.GetString("snapspace_token", "");
        if (!string.IsNullOrEmpty(token))
        {
            Debug.Log("🔐 Token found, auto-logging in...");
            SceneManager.LoadScene(1);
        }
        else
        {
            ShowPanel(signupPanel);
            ClearAllErrors();
        }
    }

    void ShowPanel(GameObject panelToShow)
    {
        signupPanel.SetActive(false);
        otpPanel.SetActive(false);
        loginPanel.SetActive(false);
        forgetPanel.SetActive(false);
        panelToShow.SetActive(true);
        ClearAllErrors();

        ShowToast("Panel: " + panelToShow.name);
    }

    void ClearAllErrors()
    {
        errorTextSignup.text = "";
        errorTextOtp.text = "";
        errorTextLogin.text = "";
        errorTextForget.text = "";
    }

    void ShowToast(string msg)
    {
#if UNITY_ANDROID && !UNITY_EDITOR
        AndroidJavaClass toastClass = new AndroidJavaClass("android.widget.Toast");
        AndroidJavaObject unityActivity = new AndroidJavaClass("com.unity3d.player.UnityPlayer")
            .GetStatic<AndroidJavaObject>("currentActivity");
        AndroidJavaObject javaString = new AndroidJavaObject("java.lang.String", msg);
        AndroidJavaObject toast = toastClass.CallStatic<AndroidJavaObject>("makeText", unityActivity, javaString, toastClass.GetStatic<int>("LENGTH_SHORT"));
        toast.Call("show");
#else
        Debug.Log("Toast: " + msg);
#endif
    }

    public void OnClickRequestOtp()
    {
        if (string.IsNullOrEmpty(signupName.text) || string.IsNullOrEmpty(signupEmail.text) || string.IsNullOrEmpty(signupPassword.text))
        {
            errorTextSignup.text = "All fields are required.";
            return;
        }

        cachedSignupName = signupName.text;
        cachedSignupEmail = signupEmail.text;
        cachedSignupPassword = signupPassword.text;

        StartCoroutine(RequestOtpCoroutine());
    }

    public void Logout()
    {
        PlayerPrefs.DeleteKey("snapspace_token");
        PlayerPrefs.Save();
        SceneManager.LoadScene(0); // back to login/signup scene
    }

    IEnumerator RequestOtpCoroutine()
    {
        ShowLoadingIndicator(true); // Show loading indicator before making request

        string url = BASE_URL + "/auth/user/request-otp";

        OtpRequestBody data = new OtpRequestBody
        {
            name = cachedSignupName,
            email = cachedSignupEmail,
            password = cachedSignupPassword
        };

        string json = JsonUtility.ToJson(data);
        UnityWebRequest req = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);
        req.uploadHandler = new UploadHandlerRaw(bodyRaw);
        req.downloadHandler = new DownloadHandlerBuffer();
        req.SetRequestHeader("Content-Type", "application/json");

        yield return req.SendWebRequest();

        ShowLoadingIndicator(false); // Hide loading indicator after request finishes

        if (req.result == UnityWebRequest.Result.Success || (int)req.responseCode == 200)
        {
            ShowToast("OTP sent to email.");
            ShowPanel(otpPanel);
        }
        else
        {
            errorTextSignup.text = "Failed to send OTP. Try again.";
            Debug.LogWarning("❌ OTP request failed: " + req.error);
            Debug.LogError("📝 Server Response: " + req.downloadHandler.text);
        }
    }

    public void OnClickVerifyOtp()
    {
        if (string.IsNullOrEmpty(signupOtp.text))
        {
            errorTextOtp.text = "Enter the OTP.";
            return;
        }

        StartCoroutine(VerifyOtpCoroutine());
    }

    IEnumerator VerifyOtpCoroutine()
    {
        ShowLoadingIndicator(true); // Show loading indicator before making request

        string url = BASE_URL + "/auth/user/verify-otp";

        var data = new VerifyOtpRequest
        {
            name = cachedSignupName,
            email = cachedSignupEmail,
            password = cachedSignupPassword,
            otp = signupOtp.text
        };

        string json = JsonUtility.ToJson(data);
        UnityWebRequest req = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);
        req.uploadHandler = new UploadHandlerRaw(bodyRaw);
        req.downloadHandler = new DownloadHandlerBuffer();
        req.SetRequestHeader("Content-Type", "application/json");

        yield return req.SendWebRequest();

        ShowLoadingIndicator(false); // Hide loading indicator after request finishes

        if (req.result == UnityWebRequest.Result.Success || (int)req.responseCode == 200)
        {
            ShowToast("Account created!");
            ShowPanel(loginPanel);
        }
        else
        {
            errorTextOtp.text = "Invalid or expired OTP.";
            Debug.LogWarning("❌ Verify OTP failed: " + req.error);
            Debug.LogError("📝 Server Response: " + req.downloadHandler.text);
        }
    }

    public void OnClickLogin()
    {
        if (string.IsNullOrEmpty(loginEmail.text) || string.IsNullOrEmpty(loginPassword.text))
        {
            errorTextLogin.text = "Enter email and password.";
            return;
        }
        StartCoroutine(LoginCoroutine());
    }

    IEnumerator LoginCoroutine()
    {
        ShowLoadingIndicator(true); // Show loading indicator before making request

        string url = BASE_URL + "/auth/user/login";
        var json = JsonUtility.ToJson(new
        {
            email = loginEmail.text,
            password = loginPassword.text
        });

        UnityWebRequest req = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);
        req.uploadHandler = new UploadHandlerRaw(bodyRaw);
        req.downloadHandler = new DownloadHandlerBuffer();
        req.SetRequestHeader("Content-Type", "application/json");

        yield return req.SendWebRequest();

        ShowLoadingIndicator(false); // Hide loading indicator after request finishes

        if (req.result == UnityWebRequest.Result.Success)
        {
            string jsonResponse = req.downloadHandler.text;
            LoginResponse parsed = JsonUtility.FromJson<LoginResponse>(jsonResponse);

            PlayerPrefs.SetString("snapspace_token", parsed.token);
            PlayerPrefs.Save();

            ShowToast("Login successful!");
            ClearInputFields(); // Clear input fields after successful login

            yield return new WaitForSeconds(1f);
            SceneManager.LoadScene(1);
        }
        else
        {
            errorTextLogin.text = "Invalid email or password.";
        }
    }

    void ClearInputFields()
    {
        signupName.text = "";
        signupEmail.text = "";
        signupPassword.text = "";
        signupOtp.text = "";

        loginEmail.text = "";
        loginPassword.text = "";

        forgetEmail.text = "";
        forgetOtp.text = "";
        forgetNewPassword.text = "";
        forgetConfirmPassword.text = "";
    }

    public void GoToLoginPanel()
    {
        ShowPanel(loginPanel);
    }

    public void GoToSignupPanel() => ShowPanel(signupPanel);
    public void GoToForgetPanel() => ShowPanel(forgetPanel);

    void ShowLoadingIndicator(bool show)
    {
        if (loadingIndicator != null)
        {
            loadingIndicator.SetActive(show);
        }
    }
}
