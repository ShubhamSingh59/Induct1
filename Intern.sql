create database webdev;

use webdev;

create table Events(
	eventName varchar(255),
    location varchar(255),
    date date,
    description varchar(500)
);
INSERT INTO Events (eventName, location, date, description)
VALUES
('Tech Conference 2024', 'San Francisco, CA', '2024-07-15', 'A conference focusing on the latest advancements in technology and innovation.'),
('Music Festival', 'Austin, TX', '2024-08-22', 'An annual music festival featuring a variety of genres and artists from around the world.'),
('Art Expo', 'New York, NY', '2024-09-10', 'A showcase of contemporary art from emerging and established artists.'),
('Marathon', 'Boston, MA', '2024-04-21', 'A competitive marathon event attracting runners from all over the globe.');

select * from Events;  
create table eventJoiners(
	eventName varchar(255),
	name varchar(255),
    email varchar(100) unique,
    designation varchar(100),
    number varchar(20) unique
);
drop table eventjoiners;
select * from eventJoiners;
TRUNCATE TABLE eventJoiners;