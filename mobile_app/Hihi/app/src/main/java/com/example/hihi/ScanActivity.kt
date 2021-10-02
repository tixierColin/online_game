package com.example.hihi

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.budiyev.android.codescanner.AutoFocusMode
import com.budiyev.android.codescanner.CodeScanner
import com.budiyev.android.codescanner.DecodeCallback
import com.budiyev.android.codescanner.ErrorCallback
import com.budiyev.android.codescanner.ScanMode
import kotlinx.android.synthetic.main.activity_scan.*
import java.util.*

private const val CAMERA_RESQUEST_CODE = 101

class ScanActivity : AppCompatActivity() {

    private lateinit var codeScanner: CodeScanner

    private var scannedCode: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scan)
        Toast.makeText(this, "scan the game's code", Toast.LENGTH_SHORT).show()

        setupPerms()

        codeScanner()

        btnJoin.setOnClickListener {
            if (scannedCode != null) {
                val intent = Intent(this, GameActivity::class.java)
                intent.putExtra("socketAddress", scannedCode)
                startActivity(intent)
            }
        }
    }

    private fun codeScanner () {
        codeScanner = CodeScanner(this, scannerView)

        codeScanner.apply {
            camera = CodeScanner.CAMERA_BACK
            formats = CodeScanner.ALL_FORMATS

            autoFocusMode = AutoFocusMode.SAFE
            scanMode = ScanMode.CONTINUOUS
            isAutoFocusEnabled = true
            isFlashEnabled = false

            decodeCallback = DecodeCallback {
                runOnUiThread {
                    scanValue.text = it.text
                    scannedCode = it.text
                    btnJoin.visibility = View.VISIBLE
                }
            }

            errorCallback = ErrorCallback {
                runOnUiThread {
                    Log.e("Main", "Err ${it.message}")
                }
            }
        }

        scannerView.setOnClickListener {
            codeScanner.startPreview()
        }

    }

    override fun onResume() {
        super.onResume()
        codeScanner.startPreview()
    }

    override fun onPause() {
        codeScanner.releaseResources()
        super.onPause()
    }

    private fun setupPerms() {
        val perm = ContextCompat.checkSelfPermission(this,
            android.Manifest.permission.CAMERA)

        if (perm != PackageManager.PERMISSION_GRANTED) {
            makeRequest()
        }
    }

    private fun makeRequest() {
        ActivityCompat.requestPermissions(this,
            arrayOf(android.Manifest.permission.CAMERA),
            CAMERA_RESQUEST_CODE)
    }

    override fun onRequestPermissionsResult( // weird error
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        //super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        when (requestCode) {
            CAMERA_RESQUEST_CODE -> {
                if (
                    grantResults.isEmpty() ||
                    grantResults[0] != PackageManager.PERMISSION_GRANTED
                ) {
                    Toast.makeText(this, "you need the camera permission", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}