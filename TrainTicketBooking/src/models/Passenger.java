package models;

public class Passenger {
    private int passengerId;
    private String name;
    private int age;
    private String gender;
    private String email;
    private String phone;

    public Passenger() {}

    public int getPassengerId() { return passengerId; }
    public void setPassengerId(int passengerId) { this.passengerId = passengerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    @Override
    public String toString() {
        return "Passenger [" + name + ", Age: " + age + ", Gender: " + gender + 
               ", Email: " + email + ", Phone: " + phone + "]";
    }
}
