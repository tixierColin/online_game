package com.example.hihi

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.game_activity.*
import org.java_websocket.client.WebSocketClient
import org.java_websocket.handshake.ServerHandshake
import java.lang.Exception
import java.net.URI

// messages :
import com.example.hihi.message.ConnectMessage
import com.example.hihi.message.CloseMessage

import com.example.hihi.message.InputMessage
import com.example.hihi.message.InputData


import com.google.gson.Gson

class GameActivity : AppCompatActivity(), SensorEventListener {

    private lateinit var webSocketClient: WebSocketClient
    private var wsAddress: String? = null
    private lateinit var sensorManager: SensorManager
    private lateinit var acceleroMeter: Sensor
    private var playerId: String? = null
    private var roomId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.game_activity)
        wsAddress = intent.extras!!.getString("socketAddress")
        Toast.makeText(this, wsAddress, Toast.LENGTH_SHORT).show()
        initWebSocket(wsAddress)

        butt.setOnClickListener {
            webSocketClient.send("sqsq")
        }

        // sensor stuff
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        // focus in accelerometer
        acceleroMeter = sensorManager!!.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    }

    private fun initWebSocket(address: String?) {
        if (address == null) {
            return;
        }
        webSocketClient = object : WebSocketClient(URI(address)) {
            override fun onOpen(handshakedata: ServerHandshake?) {
                //msg.text = "lol"
                //this.send("hello")
            }

            override fun onMessage(msg: String?) {
                if (msg == null) { return; }

                // if null always id else always "game state ?"
                if (this@GameActivity.playerId == null) {
                    val ids = Gson().fromJson(msg, ConnectMessage::class.java)
                    this@GameActivity.playerId = ids.id
                    this@GameActivity.roomId = ids.room_id
                }
            }

            override fun onClose(code: Int, reason: String?, remote: Boolean) {

            }

            override fun onError(ex: Exception?) {
                //Log.e("socket", ex)
                //Toast.makeText(this@GameActivity, "err", Toast.LENGTH_SHORT).show()
                this@GameActivity.leaveGame()
            }

        }
        webSocketClient.connect()
    }

    override fun onPause() {
        super.onPause()
        this.leaveGame()
        sensorManager.unregisterListener(this)
    }

    override fun onResume() {
        super.onResume()
        sensorManager.registerListener(this, acceleroMeter, SensorManager.SENSOR_DELAY_UI)
    }

    private fun test(message: String?) {
        //msg.text = message
    }

    override fun onSensorChanged(p0: SensorEvent?) {
        if (p0 != null && webSocketClient.isOpen && playerId != null && roomId != null) {
            msgText.text = "x: " + p0.values[1].toString() + " y: " + p0.values[0].toString()
            webSocketClient.send(
                Gson().toJson(InputMessage(player_id = playerId, room_id = roomId,
                data = InputData(p0.values[1], p0.values[0])))
            )
        }
    }

    override fun onAccuracyChanged(p0: Sensor?, p1: Int) {
    }


    private fun leaveGame() {
        webSocketClient.send(
            Gson().toJson(CloseMessage(playerId, roomId))
        )
        webSocketClient.close()
    }
}