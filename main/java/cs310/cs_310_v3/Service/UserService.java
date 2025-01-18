package cs310.cs_310_v3.Service;
import cs310.cs_310_v3.Model.*;
import cs310.cs_310_v3.Repository.GroupRepository;
import cs310.cs_310_v3.Repository.MessageRepository;
import cs310.cs_310_v3.Repository.UserRepository;
import cs310.cs_310_v3.Util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

// USER SERVICE IS USED FOR ALL BACK-END LOGIC. REQUESTS ARE EVALUATE IN HERE AND RESPONDS ARE CREATED.
// BACKBONE OF APPLICATION

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final MessageRepository messageRepository;
    private final GroupRepository groupRepository;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, MessageRepository messageRepository, GroupRepository groupRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.messageRepository = messageRepository;
        this.groupRepository = groupRepository;

    }


    // Register a new user
    // EDGE CASE: DONE
    // OUTPUT CONTROL: DONE
    public void registerUser(String email, String password, String firstName, String lastName) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email must not be null or empty");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password must not be null or empty");
        }
        if (firstName == null || firstName.isBlank()) {
            throw new IllegalArgumentException("First name must not be null or empty");
        }
        if (lastName == null || lastName.isBlank()) {
            throw new IllegalArgumentException("Last name must not be null or empty");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }

        String hashedPassword = passwordEncoder.encode(password);
        User newUser = new User(email, hashedPassword, firstName, lastName);
        userRepository.save(newUser);
    }


    // Authenticate user during login.
    // LOGIN END
    public String authenticateUser(String email, String password) {
        // Try to find by email
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email must not be null or empty");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password must not be null or empty");
        }
        Optional<User> userOptional = userRepository.findByEmail(email);

        // If user exists and password is correct, create a TOKEN: Login successful.
        if (userOptional.isEmpty() || !passwordEncoder.matches(password, userOptional.get().getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return jwtUtil.generateToken(email); // Return the JWT token
    }


    // EDGE CASE: DONE
    // OUTPUT: DONE
    // FALSE ADDED SUCCESSFULLY
    // TRUE, REQUEST HAS SENT SUCCESSFULLY
    public boolean sendFriendRequest(String Email, String token) {

        // Check is token valid
        if (Email == null || Email.isBlank()) {
            throw new IllegalArgumentException("Email must not be null or empty");
        }

        // Get the email from the token
        String senderEmail = jwtUtil.validateToken(token);

        // Find the user and get it. If token is valid we will have a user in data
        Optional<User> senderOptional = userRepository.findByEmail(senderEmail);
        if (senderOptional.isEmpty()) {
            throw new IllegalArgumentException("Sender, very interestingly, is not exist");
        }
        User sender = senderOptional.get();

        // Try to find otherUser.
        Optional<User> otherUserOptional = userRepository.findByEmail(Email);
        if (otherUserOptional.isEmpty()) {
            throw new IllegalArgumentException("There is no such a email");
        }

        if(otherUserOptional.get().getEmail().equals(sender.getEmail()))
        {
            throw new IllegalArgumentException("Cannot add yourself. Get a real one buddy:(");
        }

        if(sender.getFriendRequestsSend().contains(Email))
        {
            throw new IllegalArgumentException("You have already sent request to this user: " + Email);
        }

        if(sender.getFriends().contains(Email))
        {
            throw new IllegalArgumentException("You are already friends with this user: " + Email);
        }

        if(sender.getFriendRequestsReceive().contains(Email))
        {
            acceptFriendRequest(Email, token, "accept");
            return false;
        }

        User otherUser = otherUserOptional.get();
        otherUser.getFriendRequestsReceive().add(senderEmail);
        sender.getFriendRequestsSend().add(otherUser.getEmail());
        userRepository.save(otherUser);
        userRepository.save(sender);
        return true;

    }


    // EDGE CASE: PARTIAL
    // OUTPUT: DONE
    public boolean acceptFriendRequest(String Email, String token, String accept_or_reject)
    {
        if (Email == null || Email.isBlank()) {
            throw new IllegalArgumentException("Email must not be null or empty");
        }
        if (accept_or_reject == null || (!accept_or_reject.equals("accept") && !accept_or_reject.equals("reject"))) {
            throw new IllegalArgumentException("accept_or_reject must be either 'accept' or 'reject'.");
        }


        String CurrentEmail = jwtUtil.validateToken(token);
        Optional<User> CurrentUserOptional = userRepository.findByEmail(CurrentEmail);
        User CurrentUser = CurrentUserOptional.get();

        if (CurrentUser.getFriendRequestsReceive().contains(Email))
        {
            if (accept_or_reject.equals("accept"))
            {
                // Current user friends updated, and request list removed.
                CurrentUser.getFriends().add(Email);
                CurrentUser.getFriendRequestsReceive().remove(Email);

                // Find the accepted user.
                User otherUser = userRepository.findByEmail(Email).get();

                // Remove from sent list, update friend list.
                otherUser.getFriends().add(CurrentEmail);
                otherUser.getFriendRequestsSend().remove(CurrentEmail);

                // Update repository
                userRepository.save(otherUser);
                userRepository.save(CurrentUser);

                System.out.println(CurrentEmail + " accepted " + Email + "'s request.");
                return true;
            }
            else // "reject"
            {
                User otherUser = userRepository.findByEmail(Email).get();
                otherUser.getFriendRequestsSend().remove(CurrentEmail);
                CurrentUser.getFriendRequestsReceive().remove(Email);

                userRepository.save(otherUser);
                userRepository.save(CurrentUser);
                return false;
            }
        }
        else
        {

            if (CurrentUser.getFriends().contains(Email))
            {
                throw new IllegalArgumentException("This user is already your friend");
            }
            else if (CurrentUser.getEmail().equals(Email))
            {
                if (accept_or_reject.equals("accept")){
                    throw new IllegalArgumentException("Are you really trying to accept yourself?");
                }
                else {
                    throw new IllegalArgumentException("Don't reject yourself, we believe in you.");
                }
            }
            else
            {
                throw new IllegalArgumentException("There is no such an email in the friend request list");
            }
        }
    }


    // Accept or reject all friend requests.
    public boolean acceptAll(FriendRequest request, String token)
    {
        if (request.getAccept_or_reject() == null || (!request.getAccept_or_reject().equals("accept") && !request.getAccept_or_reject().equals("reject"))) {
            throw new IllegalArgumentException("accept_or_reject must be either 'accept' or 'reject'.");
        }

        String CurrentEmail = jwtUtil.validateToken(token);
        User CurrentUser = userRepository.findByEmail(CurrentEmail).get();

        if(CurrentUser.getFriendRequestsReceive().isEmpty())
        {
            if (request.getAccept_or_reject().equals("accept"))
            {
                throw new IllegalArgumentException("There is no friend request to accept");
            }
            else
            {
                throw new IllegalArgumentException("There is no friend request to reject");
            }

        }

        int size = CurrentUser.getFriendRequestsReceive().size();
        if (request.getAccept_or_reject().equals("accept"))
        {
            for (int i = size - 1; i >= 0; i--)
            {
                String Email = CurrentUser.getFriendRequestsReceive().get(i);
                acceptFriendRequest(Email, token, "accept");
            }
            return true;
        }
        else
        {
            for (int i = size - 1; i >= 0; i--) {
                String Email = CurrentUser.getFriendRequestsReceive().get(i);
                acceptFriendRequest(Email, token, "reject");
            }
            return false;
        }
    }


    // Get friends list from the repository
    public List<String> getFriends(String token)
    {
        String CurrentEmail = jwtUtil.validateToken(token);

        return userRepository.findByEmail(CurrentEmail).get().getFriends();
    }

    // Get username from the token provided.
    public String getUsername(String token)
    {
        return jwtUtil.validateToken(token);
    }

    // Get pending list, exract the user from token.
    public List<String> getPendings(String token)
    {
        String CurrentEmail = jwtUtil.validateToken(token);

        return userRepository.findByEmail(CurrentEmail).get().getFriendRequestsReceive();
    }

    // Get sending list, extract the user from token.
    public List<String> getSendings(String token)
    {
        String CurrentEmail = jwtUtil.validateToken(token);

        return userRepository.findByEmail(CurrentEmail).get().getFriendRequestsSend();
    }

    // Get group list of a user, exract the user from token.
    public List<String> getGroups(String token)
    {
        String CurrentEmail = jwtUtil.validateToken(token);

        return userRepository.findByEmail(CurrentEmail).get().getGroups();
    }

    // Send message, messageSent model provides necessary fields. For more information, check model section.
    public boolean sendMessage(MessageSent message, String token)
    {

        // Check whether message is there.
        if (message.getMessage() == null || message.getMessage().isBlank()) {
            throw new IllegalArgumentException("Message must not be null or empty");
        }
        // check whether Receiver is there.
        if (message.getReceiver() == null || message.getReceiver().isBlank()) {
            throw new IllegalArgumentException("Receiver must not be null or empty");
        }

        // Check whether token is valid. Extract the email.
        String CurrentEmail = jwtUtil.validateToken(token);
        // Extract the current user(sender).
        User CurrentUser = userRepository.findByEmail(CurrentEmail).get();

        // Extract the receiver and message to send him/her.
        String receiver = message.getReceiver();
        String realMessage = message.getMessage();

        // Later functionality will be added
        // What happens when the user is found, but not your friend. Do you want to add him/her?
        if (!CurrentUser.getFriends().contains(receiver))
        {
            throw new IllegalArgumentException("The receiver is not your friend");
        }

        // If the receiver is your friend, extract the user from repository.
        User ReceiverUser = userRepository.findByEmail(receiver).get();

        // Message with id is created.
        Message data = new Message(ReceiverUser.getEmail(), CurrentUser.getEmail());
        // Get the id.
        String id = data.getId();

        // Try to find the message in the repository.
        Optional<Message> messageOptional = messageRepository.findById(id);
        if (messageOptional.isPresent())
        {
            data = messageOptional.get();   // If message is found, get it.
        }

        // Create the message block. Sender and the message.
        MessageBlock currentMessageBlock = new MessageBlock(CurrentEmail, realMessage);

        data.addMessage(currentMessageBlock);   // Add the message Block.
        messageRepository.save(data);           // Save back to the repository.
        return true;
    }


    // Get message history, exract the user from token.
    public List<MessageBlock> getMessages(String email, String token)
    {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email must not be null or empty");
        }
        String CurrentEmail = jwtUtil.validateToken(token);
        User CurrentUser = userRepository.findByEmail(CurrentEmail).get();

        if(!CurrentUser.getFriends().contains(email))
        {
            throw new IllegalArgumentException("This user is not your friend");
        }

        String[] users = new String[2];
        users[0] = CurrentUser.getEmail();
        users[1] = email;
        Arrays.sort(users);
        String id = users[0] + "_" + users[1];

        Optional<Message> messageOptional = messageRepository.findById(id);
        if(messageOptional.isEmpty())
        {
            throw new IllegalArgumentException("There is no recorded message with this user: " + email);
        }
        else
        {
            Message message = messageOptional.get();
            return message.getMessages();
        }
    }


    // Create group. Necessary fields are coming from GroupCreateRequest Model. For more information refer to Model section.
    public boolean createGroup(GroupCreateRequest request, String token)
    {
        if (request.getGroupMembers() == null || request.getGroupMembers().isEmpty()) {
            throw new IllegalArgumentException("GroupMembers must not be null or empty");
        }
        if (request.getGroupName() == null || request.getGroupName().isBlank()) {
            throw new IllegalArgumentException("GroupName must not be null or empty");
        }
        String CurrentEmail = jwtUtil.validateToken(token);

        List<String>  groupMembers = request.getGroupMembers();
        String groupName = request.getGroupName();

        for (String email : groupMembers) {
            if (userRepository.findByEmail(email).isEmpty()) {
                throw new IllegalArgumentException("Invalid group member email: " + email);
            }
        }

        groupMembers.add(CurrentEmail);
        Group group = new Group(groupName, groupMembers, CurrentEmail);
        String id = group.getId();

        if (groupRepository.findById(id).isPresent()) {
            throw new IllegalArgumentException("You already use this name for another group");
        }

        for (String email : groupMembers) {
            User member = userRepository.findByEmail(email).get();
            member.getGroups().add(id);
            userRepository.save(member);
        }

        groupRepository.save(group);
        return true;
    }


    // Add member to a group. Username exracted from token. Necessary fields are coming from GroupAddRequest model.
    // For more information about GroupAddRequest, refer to Model section.
    public boolean addMember(String groupID, GroupAddRequest email, String token)
    {
        if (groupID == null || groupID.isBlank()) {
            throw new IllegalArgumentException("In the URL, groupID must not be null or empty");
        }
        if (email.getEmail() == null || email.getEmail().isBlank()) {
            throw new IllegalArgumentException("email must not be null or empty");
        }
        String CurrentEmail = jwtUtil.validateToken(token);
        User CurrentUser = userRepository.findByEmail(CurrentEmail).get();

        Optional<Group> groupOptional = groupRepository.findById(groupID);
        if (groupOptional.isEmpty()) {
            throw new IllegalArgumentException("There is no such group");
        }

        Group group = groupOptional.get();
        String creator = groupID.split("_")[0];

        if (!group.getGroupMembers().contains(CurrentEmail))
        {
            throw new IllegalArgumentException("There is no such group");
        }

        if (!CurrentEmail.equals(creator)) {
            throw new IllegalArgumentException("You are not the owner of the group");
        }

        if (group.getGroupMembers().contains(email.getEmail())) {
            throw new IllegalArgumentException("This user: " + email.getEmail() + " is already member of the group");
        }
        if (userRepository.findByEmail(email.getEmail()).isEmpty()) {
            throw new IllegalArgumentException("Invalid email: " + email.getEmail());
        }

        User member = userRepository.findByEmail(email.getEmail()).get();
        member.getGroups().add(groupID);
        userRepository.save(member);

        group.getGroupMembers().add(email.getEmail());
        groupRepository.save(group);
        return true;

    }


    // Send message to a group. Necessary fields are coming from MessageBlock model. For more information, refer to Model Section.
    public void sendMessage(String groupID, MessageBlock message, String token)
    {
        if (groupID == null || groupID.isBlank()) {
            throw new IllegalArgumentException("In the URL, groupID must not be null or empty");
        }
        if (message.getMessage() == null || message.getMessage().isBlank()) {
            throw new IllegalArgumentException("Message must not be null or empty");
        }

        String CurrentEmail = jwtUtil.validateToken(token);
        Optional<Group> group = groupRepository.findById(groupID);
        if (group.isEmpty())
        {
            throw new IllegalArgumentException("There is no such group");
        }
        if (!group.get().getGroupMembers().contains(CurrentEmail)) {
            throw new IllegalArgumentException("There is no such group");
        }

        MessageBlock currentMessage = new MessageBlock(CurrentEmail, message.getMessage());

        group.get().getMessages().add(currentMessage);
        groupRepository.save(group.get());
    }


    // Get message history of a group.
    public List<MessageBlock> getMessagesFromGroup(String groupID, String token)
    {
        if (groupID == null || groupID.isBlank()) {
            throw new IllegalArgumentException("In the URL, groupID must not be null or empty");
        }
        String CurrentEmail = jwtUtil.validateToken(token);

        Optional<Group> group = groupRepository.findById(groupID);
        if (group.isEmpty())
        {
            throw new IllegalArgumentException("There is no such group");
        }
        if (!group.get().getGroupMembers().contains(CurrentEmail)) {
            throw new IllegalArgumentException("There is no such group");
        }
        List<MessageBlock> messages = group.get().getMessages();
        return messages;
    }


    // Get details of a group. (Members)
    public GroupDetailResponse getDetails(String groupID, String token)
    {
        if (groupID == null || groupID.isBlank()) {
            throw new IllegalArgumentException("In the URL, groupID must not be null or empty");
        }
        String CurrentEmail = jwtUtil.validateToken(token);

        Optional<Group> group = groupRepository.findById(groupID);
        if (group.isEmpty())
        {
            throw new IllegalArgumentException("There is no such group");
        }
        if (!group.get().getGroupMembers().contains(CurrentEmail)) {
            throw new IllegalArgumentException("There is no such group");
        }
        // Return the details as a DTO

        return new GroupDetailResponse(group.get().getGroupMembers(), group.get().getCreationTime());
    }


    // Deletion of user.
    // DANGER: THE NECESSARY BACK-END IS NOT IMPLEMENTED FOR USER DELETION. UNEXPECTED BEHAVIOUR IS LIKELY.
    public boolean deleteUser(String email)
    {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent())
        {
            userRepository.delete(userOptional.get());
            return true;
        }
        return false;
    }

}

