package cs310.cs_310_v3.Controller;
import cs310.cs_310_v3.Model.*;
import cs310.cs_310_v3.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


// MOST OF THE PARAMETERS CAN BE FOUND IN MODEL. 
// FOR MORE DETAIL, REFER MODEL SECTION.

@CrossOrigin(origins = "*")
@RestController // Base URL for all user-related endpoints
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {this.userService = userService;}


    // Endpoint for user registration
    // EDGE CASE DONE
    // OUTPUT: DONE
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            userService.registerUser(user.getEmail(), user.getPassword(), user.getName(), user.getLastname());
            System.out.println("User: " + user.getEmail() + " registered successfully");
            return ResponseEntity.ok("You successfully registered!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Endpoint for user login
    // EDGE CASE: DONE
    // OUTPUT: DONE
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest request) {
        try {
            String token = userService.authenticateUser(request.getEmail(), request.getPassword());
            System.out.println(request.getEmail() + " is logged in successfully");
            return ResponseEntity.ok("You successfully enter. Here is your token:\n" + token); // Return the JWT token
        } catch (IllegalArgumentException e) {
            System.err.println("Somebody try wrong login attempt.");
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


    // Endpoint for send friend request
    // EDGE CASE: DONE
    // OUTPUT: DONE
    @PostMapping("/friends/add")
    public ResponseEntity<String> addUser(@RequestBody FriendRequest request, @RequestHeader("Auth") String token)
    {
        try {
            String email = request.getEmail();
            boolean temp = userService.sendFriendRequest(email, token);
            if (!temp) return ResponseEntity.ok("This user have already sent you request, automatically accepted");
            else return ResponseEntity.ok("Friend request has been sent successfully");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }


    // Endpoint for accept friend request
    // EDGE CASE: PARTIAL
    // OUTPUT: DONE
    @PostMapping("/friends/accept")
    public ResponseEntity<String> acceptUser(@RequestBody FriendRequest request, @RequestHeader("Auth") String token)
    {
        try {
            String email = request.getEmail();
            String accept_or_reject = request.getAccept_or_reject();
            boolean temp = userService.acceptFriendRequest(email, token, accept_or_reject);

            if (temp) return ResponseEntity.ok("You successfully accepted your request");
            else return ResponseEntity.badRequest().body("You rejected the request");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }


    // Endpoint for accept all the friends
    // EDGE CASE: It does not have
    // OUTPUT: DONE
    @PostMapping("/friends/accept/all")
    public ResponseEntity<String> acceptAll(@RequestBody FriendRequest request, @RequestHeader("Auth") String token)
    {
        try {
            boolean reply = userService.acceptAll(request, token);
            if (reply)
            {
                return ResponseEntity.ok("You successfully accepted all of your requests");
            }
            else
            {
                return ResponseEntity.badRequest().body("You rejected all of yor requests");
            }

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Endpoint for getting username
    // NOT USED IN FRONT END
    @GetMapping("/username")
    public ResponseEntity<?> getUsername(@RequestHeader("Auth") String token)
    {
        try {
            String username = userService.getUsername(token);
            return ResponseEntity.ok(username);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Endpoint for see the friend list.
    @GetMapping("/friends")
    public ResponseEntity<?> getFriends(@RequestHeader("Auth") String token)
    {
        try {
            List<String> friendList = userService.getFriends(token);
            return ResponseEntity.ok(friendList);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Endpoint for pull pending friend requests.
    @GetMapping("/friends/pending")
    public ResponseEntity<?> getPendings(@RequestHeader("Auth") String token)
    {
        try {
            List<String> pendingList = userService.getPendings(token);
            return ResponseEntity.ok(pendingList);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Endpoint for sending friend requests.
    @GetMapping("/friends/sendings")
    public ResponseEntity<?> getSendings(@RequestHeader("Auth") String token)
    {
        try {
            List<String> sendingList = userService.getSendings(token);
            return ResponseEntity.ok(sendingList);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Endpoint for send message.
    @PostMapping("/messages/send")
    public ResponseEntity<String> sendMessage(@RequestBody MessageSent message, @RequestHeader("Auth") String token)
    {
        try {
            userService.sendMessage(message, token);
            return ResponseEntity.ok("Successfully sent your message");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Retrieve message history.
    @GetMapping("/messages")
    public ResponseEntity<?> getMessages(@RequestParam String email, @RequestHeader("Auth") String token)
    {
        try {
            List<MessageBlock> messageHistory = userService.getMessages(email, token);
            return ResponseEntity.ok(messageHistory);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Get list of groups.
    @GetMapping("/groups")
    public ResponseEntity<?> getGroups(@RequestHeader("Auth") String token)
    {
        try {
            List<String> groupList = userService.getGroups(token);
            return ResponseEntity.ok(groupList);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Endpoint for creating groups.
    @PostMapping("/groups/create")
    public ResponseEntity<String> createGroup(@RequestBody GroupCreateRequest request, @RequestHeader("Auth") String token)
    {
        try {
            userService.createGroup(request, token);
            return ResponseEntity.ok("Group created successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Endpoint for adding new member to the group.
    @PostMapping("/groups/{groupID}/add-member")
    public ResponseEntity<String> addMember(@PathVariable String groupID, @RequestBody GroupAddRequest email, @RequestHeader("Auth") String token)
    {
        try {
            userService.addMember(groupID, email, token);
            return ResponseEntity.ok("Member added successfully");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Endpoint for send message inside group.
    @PostMapping ("/groups/{groupID}/send")
    public ResponseEntity<String> sendMessage(@PathVariable String groupID, @RequestBody MessageBlock message, @RequestHeader("Auth") String token)
    {
        try {
            userService.sendMessage(groupID, message, token);
            return ResponseEntity.ok("Message sent successfully");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Endpoint for retrieve message history of a group.
    @GetMapping("/groups/{groupID}/messages")
    public ResponseEntity<?> getMessagesFromGroup(@PathVariable String groupID, @RequestHeader("Auth") String token)
    {
        try {
            List<MessageBlock> messageHistory = userService.getMessagesFromGroup(groupID, token);
            return ResponseEntity.ok(messageHistory);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Endpoint for retrieve the list of members inside a group.
    @GetMapping("/groups/{groupID}/members")
    public ResponseEntity<?> getGroupDetails(@PathVariable String groupID, @RequestHeader("Auth") String token)
    {
        try {
            GroupDetailResponse groupDetails = userService.getDetails(groupID, token);
            return ResponseEntity.ok(groupDetails);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    
    // Only for test purposes.
    @GetMapping("/health")
    public ResponseEntity<String> health()
    {
        return ResponseEntity.ok("Health Check Successful");
    }
}
