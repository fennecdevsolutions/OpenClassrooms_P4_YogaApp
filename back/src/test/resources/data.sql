INSERT INTO teachers (last_name,first_name)
VALUES 
('McTeacher', 'Teacher1'),
('McTeacher', 'Teacher2'),
('McTeacher', 'Teacher3'),
('McAvailable', 'Teacher4');

INSERT INTO users (email, password, first_name, last_name, admin)
VALUES 
('user1@test.com', '$2a$12$mIa4PQcNGEUq3XUZdt/ZDug53YAsb/RA.3euxTnvn/N34U2yuhRqm', 'John', 'Doe',False),
('user2@test.com', '$2a$12$mIa4PQcNGEUq3XUZdt/ZDug53YAsb/RA.3euxTnvn/N34U2yuhRqm', 'Jane', 'Doe',False),
('admin@test.com', '$2a$12$mIa4PQcNGEUq3XUZdt/ZDug53YAsb/RA.3euxTnvn/N34U2yuhRqm', 'Admin', 'Doe',True);


INSERT INTO sessions (name, description, date, teacher_id)
VALUES 
('Easy Yoga', 'For starters', '2026-03-01', 1),
('Hard Yoga', 'For the performers', '2026-03-03', 2),
('Extreme Yoga', 'For the ones who dare!', '2026-03-20', 3);

INSERT INTO participate (session_id, user_id)
VALUES 
(3, 2);