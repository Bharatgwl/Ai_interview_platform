import React from 'react'

function QuestionListContainer({ questions }) {
    return (
        <div>
            <h2 className='font-bold text-lg !mb-5'>Generated Interview Questions</h2>
            <div className='!mt-5 !space-y-4 !bg-white'>
                {questions.map((q, i) => (
                    <div
                        key={i}
                        className='!p-4 !border !rounded-xl !bg-white !shadow-md !hover:shadow-lg !transition-all !duration-300 !ease-in-out'
                    >
                        <p className="!font-semibold !text-gray-800">Q{i + 1}: {q.question}</p>
                        <p className="!text-sm text-blue-500 !mt-1">Type: {q.type}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default QuestionListContainer
