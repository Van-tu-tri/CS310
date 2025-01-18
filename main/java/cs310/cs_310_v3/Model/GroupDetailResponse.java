package cs310.cs_310_v3.Model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupDetailResponse {
    private List<String> members;
    private LocalDateTime creationTime;
}