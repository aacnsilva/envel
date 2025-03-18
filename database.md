# Database schema

```sql
Table users (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    provider VARCHAR(255),
    provider_id VARCHAR(255)
)

Table envelopes (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    amount DECIMAL(10, 2),
    user_id INT,
    date DATE, 
    recurring BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id)
)

Table entries (
    id INT PRIMARY KEY,
    amount DECIMAL(10, 2),
    envelope_id INT,
    category_id INT,
    FOREIGN KEY (envelope_id) REFERENCES envelopes(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
)

Table categories (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
)

Table shared_envelopes (
    id INT PRIMARY KEY,
    envelope_id INT,
    user_id INT,
    FOREIGN KEY (envelope_id) REFERENCES envelopes(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
)

Table share_requests (
    id INT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    envelope_id INT,
    created_at Date,
    status ENUM('pending', 'accepted', 'rejected'),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (envelope_id) REFERENCES envelopes(id)
)
```