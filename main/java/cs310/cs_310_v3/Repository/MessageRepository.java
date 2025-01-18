package cs310.cs_310_v3.Repository;
import cs310.cs_310_v3.Model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

// THIS REPOSITORY IS USED TO GET/ PUSH MESSAGE DATA FROM/TO MONGODB SERVER.
// REPOSITORY IS A MICROSERVICE USED FOR COMMUNICATION WITH DATABASE

public interface MessageRepository extends MongoRepository<Message, String> {
    public Optional<Message> findById(String id);
}
