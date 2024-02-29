import ballerina/http;
import ballerina/random;

type Greeting record {
    string 'from;
    string to;
    string message;
};

type Rating record {
    int rating;
};

service / on new http:Listener(8090) {
    resource function get rating(string bookBame) returns Rating|error {
        int randomInteger = check random:createIntInRange(1, 10);

        Rating rating = {rating: randomInteger};
        return rating;
    }
}
