export const getReviewsQuery = `
    SELECT b.title,
           a.first_name,
           a.last_name,
           b.store_link,
           b.identifier,
           b.identifier_type,
           r.date_read,
           r.rating,
           r.blurb,
           r.full_notes
    FROM reviews AS r
             JOIN books AS b ON r.book_id = b.id
             JOIN book_authors AS ba ON ba.book_id = b.id
             JOIN authors AS a ON ba.author_id = a.id;
`;

const createAuthorsTable = `
    CREATE TABLE authors
    (
        id         SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name  VARCHAR(50) NOT NULL
    );
`;

const createBooksTable = `
    CREATE TABLE books
    (
        id         SERIAL PRIMARY KEY,
        title      VARCHAR(100),
        store_link TEXT,
        identifier TEXT UNIQUE NOT NULL,
        identifier_type        NOT NULL
    );
`;

const createBookAuthorsTable = `
    CREATE TABLE book_authors
    (
        book_id   INT REFERENCES books (id),
        author_id INT REFERENCES authors (id),
        UNIQUE (book_id, author_id)
    );
`;

const createReviewsTable = `
    CREATE TABLE reviews
    (
        id         SERIAL PRIMARY KEY,
        book_id    INT REFERENCES books (id) NOT NULL,
        date_read  DATE                      NOT NULL,
        rating     INT                       NOT NULL,
        blurb      VARCHAR(255),
        full_notes TEXT,
        CHECK (rating BETWEEN 1 AND 10)
    );
`;

const insertBooksScript = `
    INSERT INTO books (title, store_link, identifier, identifier_type)
    VALUES ('Think',
            'https://www.amazon.com/Think-Compelling-Introduction-Philosophy-1999-10-14/dp/B01FEK8JDU/ref=sr_1_2?crid=1P8RVRK03PBD3&dib=eyJ2IjoiMSJ9.9k0yiTK8eMnkkn5fRhjEsNnK3tZZ3qiVH9-Am2U2Q38I4eN9GsSfLmrjVzloTVXsF7D818TVj20tlZwbpVhMeKvJbMN3f8uf7wyuYRZgSdSuQrIUxlQBTYS9-hKkE76iRaPPLGMvNnL0T7GT3RG4h648wzOceKiSgAyFz93q2kXJRMtUyu0QZ2FI2kblnZvEsQUmL95IaUAE686tZR1ZTNrm4tGpVZJutdzYojoxWfbvH0oJUzZ71fcEJMjVoDPi.7XgehkhBjcP_AgMEF-7aBL65Ai-V0Q9dfW7dBPjUOZ8&dib_tag=se&keywords=think+blackburn&qid=1742203721&s=audible&sprefix=think+blackbu%2Caudible%2C443&sr=1-2-catcorr',
            'OL6803193M',
            'OLID');
`;

const insertAuthorsScript = `
    INSERT INTO authors (first_name, last_name)
    VALUES ('Simon', 'Blackburn');
`;

const insertBookAuthorsScript = `
    INSERT INTO book_authors(book_id, author_id)
    VALUES ((SELECT id FROM books WHERE title = 'Think'),
            (SELECT id FROM authors WHERE first_name = 'Simon' AND last_name = 'Blackburn'));
`;

const insertReviewsScript = `
    INSERT INTO reviews (book_id, date_read, rating, blurb, full_notes)
    VALUES (1,
            '2020-11-15',
            7,
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et mollis leo. Donec nec ullamcorper velit, eget auctor nunc.',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et mollis leo. Donec nec ullamcorper velit, eget auctor nunc. Nunc gravida tellus magna, eu venenatis tellus tincidunt nec. Sed pellentesque enim justo, at egestas felis interdum dictum. Aliquam luctus sed eros accumsan consectetur. Mauris commodo urna sed nibh porttitor tempus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse porttitor rutrum lacus, at mattis elit venenatis quis. Phasellus sollicitudin sapien ac quam porta consectetur. Proin bibendum at quam vitae tincidunt. Morbi vel ligula erat. Nam pharetra venenatis neque ac rhoncus. Nam suscipit massa et faucibus lacinia. Donec vitae odio vitae elit consectetur pulvinar. Suspendisse lacus augue, pretium ut dui at, gravida vehicula nulla. Suspendisse scelerisque hendrerit commodo. Praesent et quam ac velit porta laoreet. Praesent libero elit, rutrum ac efficitur dapibus, pellentesque a neque. Nulla et tellus vitae lorem pulvinar aliquet et at est. Etiam tincidunt libero nec porta porta. Integer pellentesque ex et mauris rutrum, ultrices luctus justo blandit. Sed eu lobortis felis, maximus maximus metus. Ut nec ipsum congue, condimentum nibh eu, scelerisque diam. Pellentesque eu purus erat. Suspendisse potenti. Etiam id felis quis sem fermentum iaculis. Nam lacinia nulla dolor, vitae porttitor mauris aliquam et. Pellentesque non tempor augue. Phasellus eget elit ornare, volutpat elit vel, vulputate ligula. Quisque in tristique ex. Integer sagittis velit aliquet, euismod diam non, eleifend quam. Ut dignissim lacinia libero, ut elementum erat faucibus at. Cras sed elementum est, vel convallis mi. Quisque laoreet sodales dictum. Donec ac augue eu magna volutpat porta. Vivamus eu sem arcu.'),
           (2,
            '2024-04-03',
            8,
            'Phasellus ligula metus, porta ut consectetur at, iaculis id sapien.',
            'Phasellus ligula metus, porta ut consectetur at, iaculis id sapien. Donec sit amet est et lorem faucibus rhoncus. Vivamus metus ligula, mattis sagittis urna sit amet, ultrices feugiat leo. Phasellus mollis ante vel vestibulum viverra. Phasellus feugiat dignissim urna, ac lobortis leo aliquet sed. Cras non dui ac ante hendrerit semper sit amet in ante. Sed lacinia, magna sit amet tempus vestibulum, ipsum nulla dignissim tellus, at facilisis enim justo sed nisl. Cras nibh magna, vulputate vel est ut, dapibus laoreet arcu. Sed lectus orci, porttitor ut justo a, ornare facilisis felis. Vestibulum dolor massa, pretium lacinia placerat sed, auctor id mi. In eget egestas enim. Nulla id luctus risus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed et ex pellentesque, convallis nunc eu, tincidunt odio. Vivamus congue justo nibh, nec cursus ante pulvinar nec. Etiam volutpat nisi quam, at blandit quam pretium a. Nullam lobortis egestas auctor. Nullam bibendum luctus dolor non rutrum. Aenean eget pretium velit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed id maximus tellus. Sed lobortis dapibus turpis ut facilisis. Suspendisse non risus non nisl vulputate mattis.');
`;



