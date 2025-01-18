package cs310.cs_310_v3.Model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

// USED IN CONTROLLER TO SEND MESSAGE INSIDE GROUPS

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageBlock
{
    private String sender;
    private String message;
    private LocalDateTime time;

    public MessageBlock(String sender, String message) {
        this.sender = sender;
        this.message = message;
        this.time = LocalDateTime.now(); // Automatically set the timestamp
    }
}
