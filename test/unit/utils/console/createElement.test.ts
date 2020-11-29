import GameMock from "../../mock/GameMock";
import { assert } from "chai";
import createElement from "../../../../src/utils/console/createElement";

describe("createElement", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = _.clone(new GameMock());
  });
  it("可以生成元素样式", () => {
    createElement.style = `<style>
    input {
        background-color: #2b2b2b;
        border: none;
        border-bottom: 1px solid #888;
        padding: 3px;
        color: #ccc;
    }
</style>`;
    assert.equal(
      createElement.customStyle(),
      "<style>input {background-color: #2b2b2b;border: none;border-bottom: 1px solid #888;padding: 3px;color: #ccc;}</style>"
    );
  });

  it("可以创建 input 输入框", () => {
    assert.equal(
      createElement.input({
        name: "TestInputName",
        label: "TestInputLabel",
        placeholder: "TestInputPlaceHolder",
        type: "input"
      }),
      'TestInputLabel <input name="TestInputName" placeholder="TestInputPlaceHolder"/>'
    );
  });

  it("可以创建 select 下拉框", () => {
    assert.equal(
      createElement.select({
        name: "TestSelectName",
        label: "TestSelectLabel",
        options: [{ value: "TestSelectOptionValue", label: "TestSelectOptionLabel" }],
        type: "select"
      }),
      'TestSelectLabel <select name="TestSelectName"> <option value="TestSelectOptionValue">TestSelectOptionLabel</option></select>'
    );
  });

  it("可以创建 button 按钮", () => {
    assert.equal(
      createElement.button({
        content: "TestButtonContent",
        command: "TestButtonCommand"
      }),
      `<button onclick="angular.element(document.body).injector().get('Console').sendCommand('(TestButtonCommand)()', 1)">TestButtonContent</button>`
    );
  });

  it("可以创建 form 表单", () => {
    Game.time = 0;
    assert.equal(
      createElement.form(
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
