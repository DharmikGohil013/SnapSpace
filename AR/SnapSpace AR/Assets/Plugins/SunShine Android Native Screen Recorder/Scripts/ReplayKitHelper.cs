using System;
using UnityEngine;

#if UNITY_IPHONE && !UNITY_EDITOR
using UnityEngine.iOS;
using UnityEngine.Apple.ReplayKit;
using System.Collections;
#endif

public class ReplayKitHelper
{
    private bool _canRecordAudio = false;

    #region Settings

    public void SetAudioCapability(bool canRecordAudio)
    {
        _canRecordAudio = canRecordAudio;
    }

    #endregion Settings 


    #region CoreFunctions

    public bool IsRecorderAvailable()
    {
#if UNITY_IPHONE && !UNITY_EDITOR
        return ReplayKit.APIAvailable;
#endif
        return false;
    }

    public bool IsRecording()
    {
#if UNITY_IPHONE && !UNITY_EDITOR
        return  ReplayKit.isRecording;;
#endif
        return false;
    }

    public bool StartRecording()
    {
#if UNITY_IPHONE && !UNITY_EDITOR
        var recording = ReplayKit.isRecording;

        if (IsRecorderAvailable() == false)
        {
            Debug.LogError("Recording Unavailable... ");
            return false;
        }

        if (recording == false)
        {
            DiscardRecordings();
            return ReplayKit.StartRecording(_canRecordAudio);
        }
#endif
        return false;
    }

    public void StopRecording()
    {
        #if UNITY_IPHONE && !UNITY_EDITOR
        ReplayKit.StopRecording();
        #endif
    }


   

    public bool ShowPreview()
    {
        #if UNITY_IPHONE && !UNITY_EDITOR
        if (ReplayKit.recordingAvailable)
            return ReplayKit.Preview();

        return false;
        #endif
        return false;
    }

    public void DiscardRecordings()
    {
        #if UNITY_IPHONE && !UNITY_EDITOR
        ReplayKit.Discard();
        #endif
    }

    #endregion CoreFunctions
}

