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
        public string name; // Add this line to match backend if it returns name
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

    public static string UserToken { get; private set; }
    public static string UserName => PlayerPrefs.GetString("snapspace_username", "User");

    void Start()
    {
        Debug.Log("[AuthManager] Start called");
        string token = PlayerPrefs.GetString("snapspace_token", "");
        Debug.Log($"[AuthManager] Loaded token: {token}");
        UserToken = token;
        if (!string.IsNullOrEmpty(token))
        {
            Debug.Log("[AuthManager] Token found, auto-logging in...");
            Debug.Log("🔐 Token found, auto-logging in...");
            SceneManager.LoadScene(1);
        }
        else
        {
            Debug.Log("[AuthManager] No token found, showing signup panel");
            ShowPanel(signupPanel);
            ClearAllErrors();
        }
    }

    void ShowPanel(GameObject panelToShow)
    {
        Debug.Log($"[AuthManager] ShowPanel called: {panelToShow.name}");
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
        Debug.Log("[AuthManager] ClearAllErrors called");
        errorTextSignup.text = "";
        errorTextOtp.text = "";
        errorTextLogin.text = "";
        errorTextForget.text = "";
    }

    void ShowToast(string msg)
    {
        Debug.Log($"[AuthManager] ShowToast: {msg}");
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
        Debug.Log("[AuthManager] OnClickRequestOtp called");
        if (string.IsNullOrEmpty(signupName.text) || string.IsNullOrEmpty(signupEmail.text) || string.IsNullOrEmpty(signupPassword.text))
        {
            errorTextSignup.text = "All fields are required.";
            Debug.LogWarning("[AuthManager] Signup fields missing");
            return;
        }

        cachedSignupName = signupName.text;
        cachedSignupEmail = signupEmail.text;
        cachedSignupPassword = signupPassword.text;

        Debug.Log($"[AuthManager] Cached signup: {cachedSignupName}, {cachedSignupEmail}");

        StartCoroutine(RequestOtpCoroutine());
    }

    public void Logout()
    {
        Debug.Log("[AuthManager] Logout called");
        PlayerPrefs.DeleteKey("snapspace_token");
        PlayerPrefs.Save();
        UserToken = null;
        SceneManager.LoadScene(0); // back to login/signup scene
    }

    IEnumerator RequestOtpCoroutine()
    {
        Debug.Log("[AuthManager] RequestOtpCoroutine started");
        ShowLoadingIndicator(true); // Show loading indicator before making request

        string url = BASE_URL + "/auth/user/request-otp";

        Debug.Log($"[AuthManager] Requesting OTP at: {url}");

        OtpRequestBody data = new OtpRequestBody
        {
            name = cachedSignupName,
            email = cachedSignupEmail,
            password = cachedSignupPassword
        };

        string json = JsonUtility.ToJson(data);
        Debug.Log($"[AuthManager] OTP request JSON: {json}");
        UnityWebRequest req = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);
        req.uploadHandler = new UploadHandlerRaw(bodyRaw);
        req.downloadHandler = new DownloadHandlerBuffer();
        req.SetRequestHeader("Content-Type", "application/json");

        yield return req.SendWebRequest();

        ShowLoadingIndicator(false); // Hide loading indicator after request finishes

        if (req.result == UnityWebRequest.Result.Success || (int)req.responseCode == 200)
        {
            Debug.Log("[AuthManager] OTP sent to email");
            ShowToast("OTP sent to email.");
            ShowPanel(otpPanel);
        }
        else
        {
            Debug.LogWarning($"[AuthManager] Failed to send OTP: {req.error}");
            errorTextSignup.text = "Failed to send OTP. Try again.";
            Debug.LogWarning("❌ OTP request failed: " + req.error);
            Debug.LogError("📝 Server Response: " + req.downloadHandler.text);
        }
    }

    public void OnClickVerifyOtp()
    {
        Debug.Log("[AuthManager] OnClickVerifyOtp called");
        if (string.IsNullOrEmpty(signupOtp.text))
        {
            errorTextOtp.text = "Enter the OTP.";
            Debug.LogWarning("[AuthManager] OTP field empty");
            return;
        }

        StartCoroutine(VerifyOtpCoroutine());
    }

    IEnumerator VerifyOtpCoroutine()
    {
        Debug.Log("[AuthManager] VerifyOtpCoroutine started");
        ShowLoadingIndicator(true); // Show loading indicator before making request

        string url = BASE_URL + "/auth/user/verify-otp";

        Debug.Log($"[AuthManager] Verifying OTP at: {url}");

        var data = new VerifyOtpRequest
        {
            name = cachedSignupName,
            email = cachedSignupEmail,
            password = cachedSignupPassword,
            otp = signupOtp.text
        };

        string json = JsonUtility.ToJson(data);
        Debug.Log($"[AuthManager] Verify OTP JSON: {json}");
        UnityWebRequest req = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);
        req.uploadHandler = new UploadHandlerRaw(bodyRaw);
        req.downloadHandler = new DownloadHandlerBuffer();
        req.SetRequestHeader("Content-Type", "application/json");

        yield return req.SendWebRequest();

        ShowLoadingIndicator(false); // Hide loading indicator after request finishes

        if (req.result == UnityWebRequest.Result.Success || (int)req.responseCode == 200)
        {
            Debug.Log("[AuthManager] Account created!");
            ShowToast("Account created!");
            // Save the user name for profile page
            PlayerPrefs.SetString("snapspace_username", cachedSignupName);
            PlayerPrefs.Save();
            ShowPanel(loginPanel);
        }
        else
        {
            Debug.LogWarning($"[AuthManager] Invalid or expired OTP: {req.error}");
            errorTextOtp.text = "Invalid or expired OTP.";
            Debug.LogWarning("❌ Verify OTP failed: " + req.error);
            Debug.LogError("📝 Server Response: " + req.downloadHandler.text);
        }
    }

    public void OnClickLogin()
    {
        Debug.Log("[AuthManager] OnClickLogin called");
        if (string.IsNullOrEmpty(loginEmail.text) || string.IsNullOrEmpty(loginPassword.text))
        {
            errorTextLogin.text = "Enter email and password.";
            Debug.LogWarning("[AuthManager] Login fields missing");
            return;
        }
        StartCoroutine(LoginCoroutine());
    }

    IEnumerator LoginCoroutine()
    {
        Debug.Log("[AuthManager] LoginCoroutine started");
        ShowLoadingIndicator(true); // Show loading indicator before making request

        string url = BASE_URL + "/auth/user/login";
        Debug.Log($"[AuthManager] Login URL: {url}");
        var json = JsonUtility.ToJson(new
        {
            email = loginEmail.text,
            password = loginPassword.text
        });

        Debug.Log($"[AuthManager] Login JSON: {json}");

        UnityWebRequest req = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);
        req.uploadHandler = new UploadHandlerRaw(bodyRaw);
        req.downloadHandler = new DownloadHandlerBuffer();
        req.SetRequestHeader("Content-Type", "application/json");

        yield return req.SendWebRequest();

        ShowLoadingIndicator(false); // Hide loading indicator after request finishes

        if (req.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("[AuthManager] Login success");
            string jsonResponse = req.downloadHandler.text;
            Debug.Log($"[AuthManager] Login response: {jsonResponse}");
            LoginResponse parsed = JsonUtility.FromJson<LoginResponse>(jsonResponse);

            PlayerPrefs.SetString("snapspace_token", parsed.token);
            UserToken = parsed.token;
            // Save the real name if available, otherwise fallback to email
            PlayerPrefs.SetString("snapspace_username", string.IsNullOrEmpty(parsed.name) ? loginEmail.text : parsed.name);
            PlayerPrefs.Save();

            ShowToast("Login successful!");
            ClearInputFields(); // Clear input fields after successful login

            yield return new WaitForSeconds(1f);
            SceneManager.LoadScene(1);
        }
        else
        {
            Debug.LogWarning($"[AuthManager] Login failed: {req.error}");
            errorTextLogin.text = "Invalid email or password.";
        }
    }

    void ClearInputFields()
    {
        Debug.Log("[AuthManager] ClearInputFields called");
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
        Debug.Log("[AuthManager] GoToLoginPanel called");
        ShowPanel(loginPanel);
    }

    public void GoToSignupPanel() => ShowPanel(signupPanel);
    public void GoToForgetPanel() => ShowPanel(forgetPanel);

    void ShowLoadingIndicator(bool show)
    {
        Debug.Log($"[AuthManager] ShowLoadingIndicator: {show}");
        if (loadingIndicator != null)
        {
            loadingIndicator.SetActive(show);
        }
    }
}
