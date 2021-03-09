import CreateElement from "@/utils/console/createElement";
import { assert } from "chai";
import { refreshGlobalMock } from "@mock/index";

describe("CreateElement", () => {
  beforeEach(() => {
    refreshGlobalMock();
  });
  it("CreateElement 可以初始化", () => {
    const createElement = new CreateElement();
    assert.isDefined(createElement);
  });

  it("可以生成元素样式", () => {
    CreateElement.style = `<style>
    input {
        background-color: #2b2b2b;
        border: none;
        border-bottom: 1px solid #888;
        padding: 3px;
        color: #ccc;
    }
</style>`;
    assert.equal(
      CreateElement.customStyle(),
      "<style>input {background-color: #2b2b2b;border: none;border-bottom: 1px solid #888;padding: 3px;color: #ccc;}</style>"
    );
  });

  it("可以创建 input 输入框", () => {
    assert.equal(
      CreateElement.input({
        name: "TestInputName",
        label: "TestInputLabel",
        placeholder: "TestInputPlaceHolder",
        type: "input"
      }),
      'TestInputLabel <input name="TestInputName" placeholder="TestInputPlaceHolder"/>'
    );

    assert.equal(
      CreateElement.input({
        name: "TestInputName",
        type: "input"
      }),
      ' <input name="TestInputName" placeholder=""/>'
    );
  });

  it("可以创建 select 下拉框", () => {
    assert.equal(
      CreateElement.select({
        name: "TestSelectName",
        label: "TestSelectLabel",
        options: [{ value: "TestSelectOptionValue", label: "TestSelectOptionLabel" }],
        type: "select"
      }),
      'TestSelectLabel <select name="TestSelectName"> <option value="TestSelectOptionValue">TestSelectOptionLabel</option></select>'
    );

    assert.equal(
      CreateElement.select({
        name: "TestSelectName",
        options: [{ value: "TestSelectOptionValue", label: "TestSelectOptionLabel" }],
        type: "select"
      }),
      ' <select name="TestSelectName"> <option value="TestSelectOptionValue">TestSelectOptionLabel</option></select>'
    );
  });

  it("可以创建 button 按钮", () => {
    assert.equal(
      CreateElement.button({
        content: "TestButtonContent",
        command: "TestButtonCommand"
      }),
      `<button onclick="angular.element(document.body).injector().get('Console').sendCommand('(TestButtonCommand)()', 1)">TestButtonContent</button>`
    );
  });

  it("可以创建 form 表单", () => {
    Game.time = 0;
    assert.equal(
      CreateElement.form(
        "TestFormName",
        [
          {
            name: "TestFormInputName",
            label: "TestFormInputLabel",
            placeholder: "TestFormInputPlaceHolder",
            type: "input"
          },
          {
            name: "TestFormSelectName",
            label: "TestFormSelectLabel",
            options: [{ value: "TestFormSelectOptionValue", label: "TestFormSelectOptionLabel" }],
            type: "select"
          }
        ],
        {
          content: "TestFormButtonContent",
          command: "TestFormButtonCommand"
        }
      ),
      '<style>input {background-color: #2b2b2b;border: none;border-bottom: 1px solid #888;padding: 3px;color: #ccc;}</style><form name=\'TestFormName0\'>TestFormInputLabel <input name="TestFormInputName" placeholder="TestFormInputPlaceHolder"/>TestFormSelectLabel <select name="TestFormSelectName"> <option value="TestFormSelectOptionValue">TestFormSelectOptionLabel</option></select><button type="button" onclick="(() => {const form = document.forms[\'TestFormName0\'];let formDatas = {};[\'TestFormInputName\',\'TestFormSelectName\'].map(eleName => formDatas[eleName] = form[eleName].value);angular.element(document.body).injector().get(\'Console\').sendCommand(`(TestFormButtonCommand)(${JSON.stringify(formDatas)})`, 1);})()">TestFormButtonContent</button></form>'
    );
  });
});
