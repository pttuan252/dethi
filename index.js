const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000;

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(express.static('public'));
app.use(express.json());

async function getSaleCourses(req, res) {
  try {
    await client.connect();
    const database = client.db('TrungTam');
    const courses = database.collection('Course');

    const saleCourses = await courses.find({ sale: { $gt: 0 } }).toArray();
    res.json(saleCourses);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
}

async function deleteCourse(req, res) {
  const idclass = req.params.idclass;

  try {
    await client.connect();
    const database = client.db('TrungTam');
    const courses = database.collection('Course');

    const result = await courses.deleteOne({ _id: idclass });

    if (result.deletedCount === 1) {
      res.send('Xóa thành công');
    } else {
      res.send('Không tìm thấy khóa học');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
}

app.get('/getsale', getSaleCourses);
app.delete('/deletecourse/:idclass', deleteCourse);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});