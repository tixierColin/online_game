package com.example.hihi.message

//data class InputMessage(val x: Float = 0F, val y: Float = 0F)

data class InputMessage(
    val player_id: String?,
    val room_id: String?,
    val type: String = "input",
    val data: InputData
)

data class InputData (val x: Float, val y: Float)
