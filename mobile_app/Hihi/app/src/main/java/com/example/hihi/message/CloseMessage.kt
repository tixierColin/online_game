package com.example.hihi.message

data class CloseMessage(
    val player_id: String?,
    val room_id: String?,
    val type: String = "close"
)