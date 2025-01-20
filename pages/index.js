import { useState, useEffect } from 'react';
import "../app/globals.css";
import Image from 'next/image'; // Import Next.js Image component

export default function Home() {
    const [tasks, setTasks] = useState([]); // Array to store tasks
    const [newTask, setNewTask] = useState(''); // Store new task title as string
    const [newDescription, setNewDescription] = useState(''); // Store new task description as string
    const [filter, setFilter] = useState("all"); // Store the current selected filter for filter section
    const [activeTask, setActiveTask] = useState(null); // Store which task is selected by user to perform actions like delete task or other
    const [newTaskMenu, setNewTaskMenu] = useState(false); // Store states of new task menu

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        setTasks(data);
    };

    const addTask = async () => {
        if (!newTask.trim()) return;

        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTask, description: newDescription })
        });
        setNewTask('');
        setNewDescription('');
        fetchTasks();
    };

    const toggleTask = async (id, status) => {
        await fetch(`/api/tasks?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: status })
        });
        fetchTasks();
    };

    const deleteTask = async (id) => {
        await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
        fetchTasks();
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    return (
        <div className='bg-slate-50'>
            <div className='grid grid-flow-col justify-between px-3 mb-4 pt-3'>
                <div className='text-black'>
                    {/* Updated img tag to Image from next/image */}
                    <Image src='/u3.jpg' alt='User Profile' width={60} height={60} className='rounded-full' />
                </div>
                <button className='text-white bg-black px-6 py-3 rounded-full text-2xl' onClick={() => setNewTaskMenu(true)}>
                    +
                </button>
            </div>

            {newTaskMenu && (
                <div className='fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-40'>
                    <div className='bg-white w-3/4 max-w-md mx-auto rounded-lg p-6 text-center space-y-3 space-x-2'>
                        <h1 className='text-gray-700 text-2xl'> Add New Task</h1>
                        <input
                            type='text'
                            className='border p-2 w-full bg-gray-50 border-gray-600 rounded-2xl placeholder:text-gray-400 text-gray-800'
                            placeholder='Task Name'
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                        <input
                            type='text'
                            className='border p-2 w-full bg-gray-50 border-gray-600 rounded-2xl placeholder:text-gray-400 text-gray-800'
                            placeholder='Task Description'
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                        <button
                            className='bg-green-500 text-white w-1/2 mx-auto px-4 py-2 rounded-full'
                            onClick={addTask}
                        >
                            Add Task
                        </button>
                        <button
                            className='border-2 border-red-500 text-red-500 w-1/2 mx-auto px-4 py-2 rounded-full'
                            onClick={() => setNewTaskMenu(false)}
                        >
                            Close Task
                        </button>
                    </div>
                </div>
            )}

            <div className='filter-section grid grid-flow-col px-3 space-x-2 pb-4'>
                <button
                    className={`filter-btn px-4 py-2 text-xs text-gray-600 ${
                        filter === 'all' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'
                    }`}
                    onClick={() => setFilter("all")}
                >
                    All
                </button>
                <button
                    className={`filter-btn px-4 py-2 text-xs text-gray-600 ${
                        filter === 'done' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'
                    }`}
                    onClick={() => setFilter("done")}
                >
                    Done
                </button>
                <button
                    className={`filter-btn px-4 py-2 text-xs text-gray-600 ${
                        filter === 'in-progress' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'
                    }`}
                    onClick={() => setFilter("in-progress")}
                >
                    In Progress
                </button>
                <button
                    className={`filter-btn px-4 py-2 text-xs text-gray-600 ${
                        filter === 'under-review' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'
                    }`}
                    onClick={() => setFilter("under-review")}
                >
                    Under Review
                </button>
            </div>

            <ul className='grid'>
                {filteredTasks.map((task) => (
                    <li key={task._id} data-status={task.status === "done" ? "done" : task.status === "under-review" ? "under-review" : "in-progress"}
                        className={`relative grid grid-flow-row items-center mb-1 rounded-3xl text-lg
                        ${task.status === "done" ? `bg-green-500` : task.status === "under-review" ? `bg-slate-400` : `bg-cyan-600`} m-2 px-4 font-light `}
                    >
                        <div className='grid grid-cols-3'>
                            <div className='col-span-2'>
                                <div className='mt-4 pb-4 text-gray-100'>
                                    <div className='flex-1' onClick={() => setActiveTask(task._id)}>
                                        {task.title}
                                    </div>
                                    <div className='text-xs mt-6'>
                                        {task.description}
                                    </div>
                                </div>
                            </div>
                            <div className='grid'>
                                <div className='text-center text-xs text-gray-50 border-2 border-gray-50 m-auto px-3 py-1 rounded-full'>
                                    {task.status === "done" ? "done" : task.status === "under-review" ? "under-review" : "In-progress"}
                                </div>
                            </div>
                        </div>

                        {activeTask === task._id && (
                            <div className='fixed inset-0 bg-gray-100 bg-opacity-95 flex flex-col justify-center items-center p-4 z-20'>
                                <div className='grid grid-flow-row space-y-2 text-base'>
                                    <button
                                        className='bg-green-500 text-white px-4 py-2 rounded-full'
                                        onClick={() => {
                                            toggleTask(task._id, "done");
                                            setActiveTask(null);
                                        }}
                                    >
                                        Mark as Done
                                    </button>
                                    <button
                                        className='bg-cyan-600 text-white px-4 py-2 rounded-full'
                                        onClick={() => {
                                            toggleTask(task._id, "in-progress");
                                            setActiveTask(null);
                                        }}
                                    >
                                        Mark as In-Progress
                                    </button>
                                    <button
                                        className='bg-slate-400 text-white px-4 py-2 rounded-full'
                                        onClick={() => {
                                            toggleTask(task._id, "under-review");
                                            setActiveTask(null);
                                        }}
                                    >
                                        Mark as Under-Review
                                    </button>
                                    <button
                                        className='border-2 border-red-500 text-red-500 px-4 py-2 rounded-full'
                                        onClick={() => {
                                            deleteTask(task._id);
                                            setActiveTask(null);
                                        }}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className='border-2 border-gray-500 text-gray-500 px-4 py-2 rounded-full'
                                        onClick={() => {
                                            setActiveTask(null);
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}

                    </li>
                ))}
            </ul>
        </div>
    );
}
