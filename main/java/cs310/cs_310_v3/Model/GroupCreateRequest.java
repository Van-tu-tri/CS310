package cs310.cs_310_v3.Model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;


// USED IN CONTROLLER TO CREATE GROUPS. 

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupCreateRequest
{
    private String groupName;
    private List<String> groupMembers;
}
